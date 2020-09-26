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

export default {
  name: 'Home',
  props: {
    store: Object,
  },
  components: {
    AccountList
  },
  computed: {
    loaded() {
      return this.store.state.accounts_loaded
    },
    error() {
      return this.store.state.error
    },
    budget_accounts() {
      return this.store.state.accounts.budget
    },
    tracking_accounts() {
      return this.store.state.accounts.tracking
    },
  },
  methods: {
    goToAccount: function(account) {
      this.$router.push({ name: "Account", params: { id: account.id }})
    },
    retryOnError: function() {
      this.store.reload()
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