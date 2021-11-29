import { YnabCache } from "./ynab_cache"
let cache = new YnabCache()

function initAccount(account) {
  account.transactions = null  // set to null until they are loaded
  account.error = ''
}

async function getOpenAccountsByType(ynab) {
  const accounts = await getOpenAccounts(ynab);
  const budget = accounts.filter(acc => acc.on_budget);
  const tracking = accounts.filter(acc => !acc.on_budget);
  return { budget, tracking };
}

async function getOpenAccounts(ynab) {
  const accounts = await getAccounts(ynab);
  return accounts.filter(acc => !acc.closed && !acc.deleted);
}

async function getAccounts(ynab) {
  try {
    const response = await ynab.accounts.getAccounts("default", cache.last_knowledge)
    response.data.accounts.forEach(initAccount)
    cache.processDelta(response.data.accounts, response.data.server_knowledge)
    return cache.items
  } catch (err) {
    const detail = err.error.detail
    throw Error(`Error while fetching accounts from YNAB: ${detail}`)
  }
}

async function getAccountById(ynab, accountId) {
  try {
    const response = await ynab.accounts.getAccountById("default", accountId)
    const account = response.data.account
    initAccount(account)
    cache.processDelta([account], cache.last_knowledge)  // don't update the knowledge ID, keep the current one
    return account
  } catch (err) {
    const detail = err.error.detail
    throw Error(`Error while fetching account from YNAB: ${detail}`)
  }
}

export default { getOpenAccountsByType, getAccountById }