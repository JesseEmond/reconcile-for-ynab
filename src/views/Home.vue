<template>
  <div class="container">
    <div v-if="loaded">
      <account-list :accounts="budgetAccounts" subheader-content="Budget Accounts"
        no-accounts-content="No budget accounts." :on-select="goToAccount" />
      <account-list :accounts="trackingAccounts" subheader-content="Tracking Accounts"
        no-accounts-content="No tracking accounts." :on-select="goToAccount" />
    </div>
    <div class="loader-container" v-else-if="!error.length">
      <span class="md-title">Loading accounts...</span>
      <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
    </div>
    <div class="md-title loader-container" v-else>
      <!-- TODO: only show this error when accounts fail loading. For per-transaction failures, show as 
        account status error -->
      <div><md-icon class="md-size-4x md-accent">error</md-icon></div>
      Oops... Something went wrong.
    </div>
  </div>
</template>

<script>
import AccountList from "../components/AccountList"

export default {
  name: 'Home',
  props: {
    store: Object,
  },
  components: {
    AccountList
  },
  computed: {
    error() {
      return this.store.state.error
    },
    loaded() {
      return this.store.state.accountsLoaded
    },
    budgetAccounts() {
      return this.store.state.accounts.budget
    },
    trackingAccounts() {
      return this.store.state.accounts.tracking
    },
  },
  methods: {
    goToAccount(account) {
      this.$router.push({ name: "Account", params: { id: account.id }})
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