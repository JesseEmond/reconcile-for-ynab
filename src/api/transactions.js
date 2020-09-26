// TODO when should we store a last_knowledge of server?
const ynab_api = require("ynab");

// YNAB handles some special transactions uniquely (e.g. Starting Balance).
// It is valid to reconcile some of them in the reconciliation app, so rename
// them so that they are not considered special. 
function rename_if_special(transaction) {
  // It is valid to reconcile a starting balance transaction through the app.
  if (transaction.payee_name.startsWith("Starting Balance")) {
    // Note: it looks like YNAB won't actually change the payee name here,
    // so it doesn't matter that try to change it.
    transaction.payee_name = "Starting YNAB Balance"
  }
}

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

async function create_reconciliation_transaction(ynab, account, amount) {
  // TODO: set category ID here based on the one extracted with name "Inflows"
  // TODO: error handling
  const transaction = {
    "account_id": account.id,
    "date": ynab_api.utils.getCurrentDateInISOFormat(),
    "cleared": "reconciled",
    "amount": amount,
    "payee_name": "YNAB Reconcile: Adjustment",
    "memo": "Entered automatically by YNAB Reconcile",
  }
  ynab.transactions.createTransaction("last-used", {transaction})
}

async function reconcile(ynab, account, transactions, reconciliation_amount) {
  // TODO: error handling?
  // TODO: default budget?
  if (reconciliation_amount != 0) {
    await create_reconciliation_transaction(ynab, account, reconciliation_amount)
    // TODO: updates the account post-reload?
  }
  if (transactions.length) {
    transactions.forEach(txn => txn.cleared = "reconciled")
    transactions.forEach(rename_if_special)
    try {
      await ynab.transactions.updateTransactions("last-used", {transactions})
    } catch(err) {
        const detail = err.error.detail
        throw Error(`Error while reconciling on YNAB: ${detail}`)
    }
  }
}

export default { get_account_transactions_by_type, reconcile }