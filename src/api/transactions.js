// TODO when should we store a last_knowledge of server?
// Can we ever know for sure that we don't need to see older transactions?

async function get_account_transactions(ynab, account_id) {
  // TODO: error handling?
  // TODO: default budget?
  const transactionsResponse = await ynab.transactions.getTransactionsByAccount(
    "last-used", account_id)
  return transactionsResponse.data.transactions
}

async function get_account_transactions_by_type(ynab, account_id) {
  const transactions = await get_account_transactions(ynab, account_id)
  const cleared = transactions.filter(txn => txn.cleared == "cleared")
  const uncleared = transactions.filter(txn => txn.cleared == "uncleared")
  return { cleared, uncleared }
}

export default { get_account_transactions_by_type }