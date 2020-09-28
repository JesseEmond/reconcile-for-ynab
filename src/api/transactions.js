// TODO: do diffs via server last knowledge
const ynabApi = require("ynab");

async function getAccountTransactions(ynab, accountId) {
  // TODO: error handling?
  const transactionsResponse = await ynab.transactions.getTransactionsByAccount(
    "default", accountId)
  return transactionsResponse.data.transactions
}

async function getAccountTransactionsByType(ynab, account_id) {
  const transactions = await getAccountTransactions(ynab, account_id)
  const cleared = transactions.filter(txn => txn.cleared == "cleared")
  const uncleared = transactions.filter(txn => txn.cleared == "uncleared")
  return { cleared, uncleared }
}

async function createReconciliationTransaction(ynab, account, amount) {
  // TODO: set category ID here based on the one extracted with name "Inflows"
  // TODO: error handling
  const transaction = {
    account_id: account.id,
    date: ynabApi.utils.getCurrentDateInISOFormat(),
    cleared: "reconciled",
    amount: amount,
    payee_name: "YNAB Reconcile: Adjustment",
    memo: "Entered automatically by YNAB Reconcile",
  }
  await ynab.transactions.createTransaction("default", {transaction})
}

async function reconcile(ynab, account, transactions, reconciliationAmount) {
  // TODO: error handling?
  if (reconciliationAmount != 0) {
    await createReconciliationTransaction(ynab, account, reconciliationAmount)
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

export default { getAccountTransactionsByType, reconcile }