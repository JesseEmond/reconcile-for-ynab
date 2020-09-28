async function get_open_accounts_by_type(ynab) {
  const open_accounts = await get_open_accounts(ynab);
  const budget = open_accounts.filter(acc => acc.on_budget);
  const tracking = open_accounts.filter(acc => !acc.on_budget);
  return { budget, tracking };
}

async function get_open_accounts(ynab) {
  const accounts = await get_accounts(ynab);
  return accounts.filter(acc => !acc.closed);
}

async function get_accounts(ynab) {
  try {
    const response = await ynab.accounts.getAccounts("default")
    const accounts = response.data.accounts
    accounts.forEach(acc => acc.transactions = false)
    if (process.env.VUE_APP_FAKE_BALANCE_AMOUNTS) {
      console.log("Faking account balances!")
      accounts.forEach(function(account) {
        const randomBalance = Math.random() * 1000.0 - 300.0
        const roundedBalance = Math.round(randomBalance * 100) / 100
        const balanceMilliunits = roundedBalance * 1000.0
        account.cleared_balance = balanceMilliunits
      })
    }
    return accounts
  } catch (err) {
    const detail = err.error.detail
    throw Error(`Error while fetching accounts from YNAB: ${detail}`)
  }
}

export default { get_open_accounts_by_type }