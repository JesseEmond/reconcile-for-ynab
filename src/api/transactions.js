const ynabApi = require("ynab");
import { YnabCache } from "./ynab_cache"
let cache = {}  // Cache, per account ID.

// Book-keeping for the inflow category, to create reconciliation transactions with
// an assigned category.
import categoriesApi from "./categories"
let cachedInflowCategoryId = null

async function getAccountTransactions(ynab, accountId) {
  try {
    if (!cache[accountId]) {
      cache[accountId] = new YnabCache()
    }
    // TODO: Any way to get last reconciliation date to reduce this initial query size?
    //       If not, request to add to the account API?
    const response = await ynab.transactions.getTransactionsByAccount(
      "default", accountId, /*since_date=*/undefined, /*type=*/undefined,
      /*last_knowledge_of_server=*/cache[accountId].last_knowledge)
    cache[accountId].processDelta(response.data.transactions,
      response.data.server_knowledge)
    return cache[accountId].items
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

async function tryGetInflowCategoryId(ynab) {
  if (cachedInflowCategoryId) {
    return cachedInflowCategoryId
  }
  try {
    const inflow = await categoriesApi.getInflowCategory(ynab)
    cachedInflowCategoryId = inflow.id
    return cachedInflowCategoryId
  } catch(err) {
    console.log(`Failed to get inflow category ID. Will not set category on reconciliation. Error: ${err}`)
    return null
  }
}

async function createReconciliationTransaction(ynab, account, amount) {
  // Note: the params set here are based on observed values from manual reconciliations, to
  // be close in format, yet still a bit different to highlight that they were created by
  // this app.
  // TODO: email YNAB API support to ask for a reconciliation API?
  const transaction = {
    account_id: account.id,
    date: ynabApi.utils.getCurrentDateInISOFormat(),
    cleared: "reconciled",
    amount: amount,
    payee_name: "YNAB Reconcile: Adjustment",
    memo: "Entered automatically by YNAB Reconcile",
  }
  let inflowCategoryId = await tryGetInflowCategoryId(ynab)
  if (inflowCategoryId) {
    transaction.category_id = inflowCategoryId
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