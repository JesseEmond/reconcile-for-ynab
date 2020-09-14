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
  // TODO: call API 
  return get_fake_accounts();
}

function get_fake_accounts() {
  return [
    {
      "id": "01234",
      "name": "TD Checking",
      "on_budget": true,
      "closed": false,
      "balance": 123000,
      "cleared_balance": 123000,
      "uncleared_balance": 124000,
      "deleted": false,
    },
    {
      "id": "56789",
      "name": "401K",
      "on_budget": false,
      "closed": false,
      "balance": 1234000,
      "cleared_balance": 1234000,
      "uncleared_balance": 125000,
      "deleted": false,
    },
  ];
}