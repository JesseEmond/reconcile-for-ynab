<template>
  <md-list class="accounts-list">
    <md-subheader>{{subheaderContent}}</md-subheader>
    <div v-for="account in accounts" :key="account.key">
      <md-list-item @click="onSelect(account)" :disabled="!!account.error">
        <account-summary :account="account" :settings="settings" />
      </md-list-item>
      <md-divider></md-divider>
    </div>
    <md-list-item v-if="!accounts.length" class="empty-accounts-list">
      {{noAccountsContent}}
    </md-list-item>
  </md-list>
</template>

<script>
import AccountSummary from "./AccountSummary"

export default {
  name: 'AccountList',
  props: {
    accounts: Array,
    subheaderContent: String,
    noAccountsContent: String,
    onSelect: Function,
    settings: Object,
  },
  components: {
    AccountSummary
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
  .md-divider {
    margin-left: 16px;
    margin-right: 16px;
  }
  .empty-accounts-list {
    font-style: italic;
  }
</style>