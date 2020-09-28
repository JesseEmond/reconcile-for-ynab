// TODO: do diffs via server last knowledge
const ynab_api = require("ynab");

async function get_account_transactions(ynab, account_id) {
  // TODO: error handling?
  const transactionsResponse = await ynab.transactions.getTransactionsByAccount(
    "default", account_id)
  return transactionsResponse.data.transactions
}

async function get_account_transactions_by_type(ynab, account_id) {
  const transactions = await get_account_transactions(ynab, account_id)
  const cleared = transactions.filter(txn => txn.cleared == "cleared")
  const uncleared = transactions.filter(txn => txn.cleared == "uncleared")
  return { cleared, uncleared }
}

async function create_reconciliation_transaction(ynab, account, amount) {
  // TODO: set category ID here based on the one extracted with name "Inflows"
  // TODO: error handling
  const transaction = {
    account_id: account.id,
    date: ynab_api.utils.getCurrentDateInISOFormat(),
    cleared: "reconciled",
    amount: amount,
    payee_name: "YNAB Reconcile: Adjustment",
    memo: "Entered automatically by YNAB Reconcile",
  }
  await ynab.transactions.createTransaction("default", {transaction})
}

async function reconcile(ynab, account, transactions, reconciliation_amount) {
  // TODO: error handling?
  if (reconciliation_amount != 0) {
    await create_reconciliation_transaction(ynab, account, reconciliation_amount)
  }
  if (transactions.length) {
    const edited = transactions.map(txn => ({id: txn.id, cleared: "reconciled"}))
    try {
      await ynab.transactions.updateTransactions("default",
        {transactions: edited})
    } catch(err) {
        const detail = err.error.detail
        throw Error(`Error while reconciling on YNAB: ${detail}`)
    }
  }
}

export default { get_account_transactions_by_type, reconcile }