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
  // TODO: error handling?
  // TODO: default budget?
  const response = await ynab.accounts.getAccounts("last-used")
  const accounts = response.data.accounts
  accounts.forEach(acc => acc.transactions = false)
  if (process.env.VUE_APP_FAKE_BALANCE_AMOUNTS) {
    console.log("Faking account balances!")
    accounts.forEach(function(account) {
      const randomBalance = Math.random() * 1000.0 - 300.0
      const balanceMilliunits = randomBalance * 1000.0
      account.cleared_balance = balanceMilliunits
    })
  }
  return accounts
}

export default { get_open_accounts_by_type }