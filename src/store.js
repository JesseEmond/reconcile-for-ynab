import accounts_api from "./api/accounts"
import transactions_api from "./api/transactions"

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