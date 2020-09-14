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
  return response.data.accounts
}

export default { get_open_accounts_by_type }