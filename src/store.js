const ynab_api = require("ynab");

import accounts_api from "./api/accounts"
import transactions_api from "./api/transactions"

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
  const {budget, tracking} = await accounts_api.get_open_accounts_by_type(ynab)
  state.accounts.budget = budget
  state.accounts.tracking = tracking
  budget.forEach(acc => fetchTransactions(ynab, acc))
  tracking.forEach(acc => fetchTransactions(ynab, acc))
  state.accounts_loaded = true;
}

async function fetchTransactions(ynab, account) {
  const {cleared, uncleared} = await transactions_api.get_account_transactions_by_type(
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
    accounts_loaded: false,
    reconciling: false,
    error: '',
  },
  logged_in: function() {
    return getWithExpiry("access_token") != null
  },
  maybe_first_load() {
    if (!this.ynab) {
      const access_token = getWithExpiry("access_token")
      this.ynab = new ynab_api.API(access_token)
      this.reload()
    }
  },
  login: function(access_token) {
    // Expires in 2h, based on YNAB documentation.
    const ttl_2h_ms = 2 * 60 * 60 * 1000
    setWithExpiry("access_token", access_token, ttl_2h_ms)
  },
  reload: async function() {
    this.state.accounts_loaded = false
    try {
      await fetchAccounts(this.ynab, this.state)
      this.state.accounts_loaded = true
    } catch(err) {
      this.error(err)
    }
  },
  reconcile: async function(account, transactions, reconciliation_amount) {
    this.state.reconciling = true
    try {
      await transactions_api.reconcile(this.ynab, account,
        transactions, reconciliation_amount)
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