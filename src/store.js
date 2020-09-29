const ynabApi = require("ynab");

import accountsApi from "./api/accounts"
import transactionsApi from "./api/transactions"

function setWithExpiry(key, value, ttl_ms) {
  const now = new Date()
  const item = {
    value,
    expiry: now.getTime() + ttl_ms,
  }
  localStorage.setItem(key, JSON.stringify(item))
}

function getWithExpiry(key) {
  const itemStr = localStorage.getItem(key)
  if (!itemStr) return null
  const item = JSON.parse(itemStr)
  const now = new Date()
  if (now.getTime() > item.expiry) {
    localStorage.removeItem(key)
    return null
  }
  return item.value
}

async function fetchAccounts(ynab, state) {
  const {budget, tracking} = await accountsApi.getOpenAccountsByType(ynab)
  state.accounts.budget = budget
  state.accounts.tracking = tracking
  budget.forEach(acc => fetchTransactions(ynab, acc))
  tracking.forEach(acc => fetchTransactions(ynab, acc))
}

async function fetchTransactions(ynab, account) {
  const {cleared, uncleared} = await transactionsApi.getAccountTransactionsByType(
    ynab, account.id)
  account.transactions = { cleared, uncleared }
}

export default {
  ynab: null,
  state: {
    accounts: {
      budget: [],
      tracking: [],
    },
    accountsLoaded: false,
    reconciling: false,
    error: '',
  },
  isLoggedIn() {
    return getWithExpiry("access_token") != null
  },
  maybeFirstLoad: async function() {
    if (!this.ynab) {
      const access_token = getWithExpiry("access_token")
      this.ynab = new ynabApi.API(access_token)
      await this.reload()
    }
  },
  login(access_token) {
    // Expires in 2h, based on YNAB documentation.
    const TTL_2H_MS = 2 * 60 * 60 * 1000
    setWithExpiry("access_token", access_token, TTL_2H_MS)
  },
  logout() {
    localStorage.removeItem("access_token")
  },
  reload: async function() {
    this.state.accountsLoaded = false
    try {
      await fetchAccounts(this.ynab, this.state)
      this.state.accountsLoaded = true
    } catch(err) {
      this.error(err)
    }
  },
  reconcile: async function(account, transactions, reconciliationAmount) {
    this.state.reconciling = true
    try {
      await transactionsApi.reconcile(this.ynab, account,
        transactions, reconciliationAmount)
      // TODO: only reload the account & its transactions
      this.reload()
    } catch(err) {
      this.error(err)
    }
    this.state.reconciling = false
  },
  error(err) {
    this.state.error = err.message
    console.log("Error details: ", err)
  },
};