<template>
  <div class="md-list-item-content account-summary">
    <md-content class="account-marker md-primary"></md-content>
    <div class="account-info">
      <span>{{account.name}}</span>

      <div class="transactions-status">
        <span v-if="!account.transactions">
          Loading...
        </span>
        <span v-else-if="cleared_transactions.length">
          <span class="transaction-count">
            <md-badge class="md-primary md-square" :md-content="cleared_transactions.length"/>
          </span>
          unreconciled transactions
        </span>
        <span v-else-if="uncleared_transactions.length">
          <span class="transaction-count">
            <md-badge class="md-primary md-square" :md-content="uncleared_transactions.length"/>
          </span>
          uncleared transactions
        </span>
        <span v-else class="reconciled-state">Reconciled</span>
      </div>
    </div>

    <div class="balance md-list-item-text">
      <currency :value="balance" />
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
  },
  components: {
    Currency,
  },
  computed: {
    balance: function() {
      return this.account.cleared_balance
    },
    cleared_transactions: function() {
      return this.account.transactions.cleared || []
    },
    uncleared_transactions: function() {
      return this.account.transactions.uncleared || []
    },
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
.reconciled-state {
  color: $color-disabled;
}
.balance {
  text-align: right;
  font-size: 22px;
}
</style>
