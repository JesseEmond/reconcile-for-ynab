async function getOpenAccountsByType(ynab) {
  const accounts = await getOpenAccounts(ynab);
  const budget = accounts.filter(acc => acc.on_budget);
  const tracking = accounts.filter(acc => !acc.on_budget);
  return { budget, tracking };
}

async function getOpenAccounts(ynab) {
  const accounts = await getAccounts(ynab);
  return accounts.filter(acc => !acc.closed);
}

async function getAccounts(ynab) {
  try {
    const response = await ynab.accounts.getAccounts("default")
    const accounts = response.data.accounts
    // Set 'null' transactions until they are loaded.
    accounts.forEach(acc => acc.transactions = null)
    accounts.forEach(acc => acc.error = '')
    return accounts
  } catch (err) {
    const detail = err.error.detail
    throw Error(`Error while fetching accounts from YNAB: ${detail}`)
  }
}

export default { getOpenAccountsByType }