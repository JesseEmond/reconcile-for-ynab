<template>
  <div>
    <md-list class="accounts-list">
      <md-subheader>Budget Accounts</md-subheader>
      <md-list-item v-for="account in budget_accounts" :key="account.key"
         @click="selectAccount(account)">
        <account-summary :account="account" />
      </md-list-item>
      <md-list-item v-if="!budget_accounts.length" class="empty-accounts-list">
        No budget accounts.
      </md-list-item>
    </md-list>

    <md-divider></md-divider>

    <md-list class="accounts-list">
      <md-subheader>Tracking Accounts</md-subheader>
      <md-list-item v-for="account in tracking_accounts" :key="account.key"
        @click="selectAccount(account)">
        <account-summary :account="account" />
      </md-list-item>
      <md-list-item v-if="!tracking_accounts.length" class="empty-accounts-list">
        No tracking accounts.
      </md-list-item>
    </md-list>
  </div>
</template>

<script>
// TODO: handle empty lists of accounts
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
  },
  methods: {
    selectAccount: function(account) {
      console.log("GOTO", account);
    },
  },
}
</script>

<style type="text/css" scoped>
  .md-subheader {
    font-weight: bold;
  }
  .accounts-list {
    width: 100%;
  }
  .empty-accounts-list {
    font-style: italic;
  }
</style>