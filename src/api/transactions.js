// TODO: do diffs via server last knowledge
const ynabApi = require("ynab");

async function getAccountTransactions(ynab, accountId) {
  try {
    const transactionsResponse = await ynab.transactions.getTransactionsByAccount(
      "default", accountId)
    return transactionsResponse.data.transactions
  } catch (err) {
    const detail = err.error.detail
    throw Error(`Error while getting transactions for account, details: ${detail}`)
  }
}

async function getAccountTransactionsByType(ynab, accountId) {
  const transactions = await getAccountTransactions(ynab, accountId)
  const cleared = transactions.filter(txn => txn.cleared == "cleared")
  const uncleared = transactions.filter(txn => txn.cleared == "uncleared")
  return { cleared, uncleared }
}

async function createReconciliationTransaction(ynab, account, amount) {
  // TODO: set category ID here based on the one extracted with name "Inflows"
  const transaction = {
    account_id: account.id,
    date: ynabApi.utils.getCurrentDateInISOFormat(),
    cleared: "reconciled",
    amount: amount,
    payee_name: "YNAB Reconcile: Adjustment",
    memo: "Entered automatically by YNAB Reconcile",
  }
  try {
    await ynab.transactions.createTransaction("default", {transaction})
  } catch (err) {
    const detail = err.error.detail
    throw Error(`Error while creating reconciliation transcation on YNAB: ${detail}`)
  }
}

async function reconcile(ynab, account, transactions, reconciliationAmount) {
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
      throw Error(`Error while reconciling transactions on YNAB: ${detail}`)
    }
  }
}

export default { getAccountTransactionsByType, reconcile }