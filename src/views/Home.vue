<template>
  <div class="container">
    <div v-if="loaded">
      <account-list :accounts="budget_accounts" subheader-content="Budget Accounts"
        no-accounts-content="No budget accounts." :on-select="goToAccount" />
      <account-list :accounts="tracking_accounts" subheader-content="Tracking Accounts"
        no-accounts-content="No tracking accounts." :on-select="goToAccount" />
    </div>
    <div class="loader-container" v-else-if="!error.length">
      <span class="md-title">Loading accounts...</span>
      <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
    </div>
    <div class="md-title loader-container" v-else>
      <div><md-icon class="md-size-4x md-accent">error</md-icon></div>
      Oops... Something went wrong.
    </div>
    <md-snackbar class="error"
      :md-duration="Infinity" :md-active="error.length > 0" md-persistent>
      <span>Error encountered: {{error}}</span>
      <md-button class="md-primary" @click="retryOnError">Retry</md-button>
    </md-snackbar>
  </div>
</template>

<script>
import AccountList from "../components/AccountList"

import accounts from "../api/accounts"
import transactions from "../api/transactions"

export default {
  name: 'Home',
  props: {
    store: Object,
  },
  components: {
    AccountList
  },
  data() {
    return {
      loaded: false,
      error: "",
    }
  },
  computed: {
    budget_accounts: function() {
      return this.store.state.accounts.budget
    },
    tracking_accounts: function() {
      return this.store.state.accounts.tracking
    },
  },
  mounted() {
    this.fetchAccounts()
  },
  methods: {
    fetchAccounts: async function() {
      try {
        const {budget, tracking} = await accounts.get_open_accounts_by_type(this.store.ynab)
        this.store.state.accounts.budget = budget
        this.store.state.accounts.tracking = tracking
        budget.forEach(this.fetchTransactions)
        tracking.forEach(this.fetchTransactions)
        this.loaded = true;
      } catch(err) {
        this.error = err.message
        console.log("Error details: ", err)
      }
    },
    fetchTransactions: async function(account) {
      const {cleared, uncleared} = await transactions.get_account_transactions_by_type(
        this.store.ynab, account.id)
      account.transactions = { cleared, uncleared }
    },
    goToAccount: function(account) {
      this.$router.push({ name: "Account", params: { id: account.id }})
    },
    retryOnError: function() {
      this.loaded = false
      this.error = ''
      this.fetchAccounts()
    }
  },
}
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
}
.loader-container {
  padding-top: 10vh;
  min-height: 90vh;
  flex-direction: column;
  align-items: center;
  display: flex;

  .md-title {
    margin-bottom: 15px;
  }
}
.error {
  .md-button {
    min-width: 50px;
  }
}
</style>