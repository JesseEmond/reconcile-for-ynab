<template>
  <div class="md-list-item-content account-summary">
    <md-content class="account-marker md-primary"></md-content>
    <div class="account-info">
      <span>{{account.name}}</span>

      <div class="transactions-status">
        <span v-if="!account.transactions && !account.error">
          Loading...
        </span>
        <span v-if="account.error" class="error-state">
          <md-icon>error_outline</md-icon>
          {{account.error}}
        </span>
        <span v-else-if="clearedTransactions.length">
          <span class="transaction-count">
            <md-badge class="md-primary md-square" :md-content="clearedTransactions.length"/>
          </span>
          unreconciled {{pluralize('transaction', clearedTransactions.length)}}
        </span>
        <span v-else-if="unclearedTransactions.length">
          {{unclearedTransactions.length}}
          uncleared {{pluralize('transaction', unclearedTransactions.length)}}
        </span>
        <span v-else class="reconciled-state">Reconciled</span>
      </div>
    </div>

    <div class="balance md-list-item-text">
      <currency :initial-value="balance" :settings="settings" />
    </div>
    <md-icon>chevron_right</md-icon>
  </div>
</template>

<script>
import Currency from './Currency'

export default {
  name: 'AccountSummary',
  props: {
    account: Object,
    settings: Object,
  },
  components: {
    Currency,
  },
  computed: {
    balance() {
      return this.account.cleared_balance
    },
    clearedTransactions() {
      return this.account.transactions.cleared || []
    },
    unclearedTransactions() {
      return this.account.transactions.uncleared || []
    },
  },
  methods: {
    pluralize(msg, count) {
      return count > 1 ? msg + 's' : msg
    }
  },
}
</script>

<style lang="scss" scoped>
.account-summary {
  width: 100%;
  padding-left: 0;
  padding-right: 0;
}
.account-marker {
  height: 38px;
  width: 4px;
  margin-top: 0;
  margin-right: 10px;
  margin-bottom: 4px;
}
.account-info {
  flex: 1.5;
}
.transactions-status {
  font-size: 14px;
  color: $color-medium-emphasis;
  vertical-align: text-bottom;
  padding-top: 2px;
}
.transaction-count {
  display: inline-flex;
}
.error-state {
  color: #ff5252;
  .md-icon-font {
    color: #ff5252;
  }
}
.reconciled-state {
  color: $color-disabled;
}
.balance {
  text-align: right;
  font-size: 22px;
}
</style>
