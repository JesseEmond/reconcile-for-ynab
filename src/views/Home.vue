<template>
  <div>
    <md-list class="accounts-list md-double-line">
      <md-subheader>Budget Accounts</md-subheader>
      <md-list-item v-for="account in budget_accounts" :key="account.key">
        <account-summary :account="account" />
      </md-list-item>
    </md-list>

    <account-summary v-for="account in tracking_accounts" :key="account.key"
      :account="account" />
  </div>
</template>

<script>
import AccountSummary from "../components/AccountSummary"

import accounts from "../api/accounts"

export default {
  name: 'Home',
  props: {
    store: Object
  },
  components: {
    AccountSummary
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
  }
}
</script>

<style type="text/css" scoped>
  .accounts-list {
    width: 100%;
  }
</style>