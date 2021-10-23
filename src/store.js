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
  const fetches = budget.map(acc => fetchTransactions(ynab, acc)).concat(
    tracking.map(acc => fetchTransactions(ynab, acc)))
  await Promise.all(fetches)
}

async function fetchTransactions(ynab, account) {
  try {
    const {cleared, uncleared} = await transactionsApi.getAccountTransactionsByType(
      ynab, account.id)
    account.transactions = { cleared, uncleared }
    account.error = ''
  } catch (err) {
    console.error(`Transactions loading failure for account ${account.id}. ${err.message}`)
    account.error = `Failed to load transactions.`
  }
}

async function reloadAccount(ynab, state, accountId) {
  let list = state.accounts.budget
  let index = list.findIndex(acc => acc.id == accountId)
  if (index < 0) {
    list = state.accounts.tracking
    index = list.findIndex(acc => acc.id == accountId)
    if (index < 0) {
      throw Error(`Account with ID ${accountId} not found.`)
    }
  }
  const account = await accountsApi.getAccountById(ynab, accountId)
  list.splice(index, 1, account)
  await fetchTransactions(ynab, account)
}

export default {
  // API instance
  ynab: null,

  state: {
    accounts: {
      budget: [],
      tracking: [],
    },

    // Loading states
    accountsLoaded: false,
    reconciling: false,

    // Error management
    error: '',
    errorRetryFn: null,
    showError: false,
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
    let self = this;
    async function doReload() {
      self.state.accountsLoaded = false
      try {
        await fetchAccounts(self.ynab, self.state)
        self.state.accountsLoaded = true
        self.ok();
      } catch(err) {
        self.error(err, doReload)
      }
    }
    await doReload()
  },
  reconcile: async function(account, transactions, reconciliationAmount) {
    let self = this;
    async function doReconcile() {
      self.state.reconciling = true
      try {
        await transactionsApi.reconcile(self.ynab, account,
          transactions, reconciliationAmount)
        self.ok()
        self.state.reconciling = false
        try {
          await reloadAccount(self.ynab, self.state, account.id)
        } catch(err) {
          self.error(err)
        }
      } catch(err) {
        self.error(err, doReconcile)
      }
    }
    await doReconcile()
  },
  error(err, retryFn) {
    this.state.showError = true
    this.state.error = err.message
    this.state.errorRetryFn = retryFn
    console.log("Error details: ", err)
  },
  ok() {
    this.state.showError = false
    this.state.error = '';
    this.state.errorRetryFn = null;
  }
};