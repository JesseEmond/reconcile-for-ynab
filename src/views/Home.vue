<template>
  <div>
    <account-list :accounts="budget_accounts" subheader-content="Budget Accounts"
      no-accounts-content="No budget accounts." />

    <account-list :accounts="tracking_accounts" subheader-content="Tracking Accounts"
      no-accounts-content="No tracking accounts." />
  </div>
</template>

<script>
import AccountList from "../components/AccountList"

import accounts from "../api/accounts"
import transactions from "../api/transactions"

export default {
  name: 'Home',
  props: {
    store: Object
  },
  components: {
    AccountList
  },
  computed: {
    budget_accounts: function() {
      return this.store.state.accounts.budget
    },
    tracking_accounts: function() {
      return this.store.state.accounts.tracking
    },
  },
  mounted: async function() { 
    const {budget, tracking} = await accounts.get_open_accounts_by_type(this.store.ynab)
    this.store.state.accounts.budget = budget
    this.store.state.accounts.tracking = tracking
    budget.forEach(this.fetchTransactions)
    tracking.forEach(this.fetchTransactions)
  },
  methods: {
    fetchTransactions: async function(account) {
      const {cleared, uncleared} = await transactions.get_account_transactions_by_type(
        this.store.ynab, account.id)
      account.transactions = { cleared, uncleared }
    }
  },
}
</script>