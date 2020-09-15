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

    <div class="currency md-list-item-text">
      <span :class="{positive: balance >= 0, negative: balance < 0}">
        {{formatBalance(balance)}}
      </span>
    </div>
    <md-icon>chevron_right</md-icon>
  </div>
</template>

<script>
const ynab = require("ynab");

export default {
  name: 'AccountSummary',
  props: {
    account: Object,
  },
  computed: {
    balance: function() {
      const balanceMilliunits = this.account.cleared_balance
      return ynab.utils.convertMilliUnitsToCurrencyAmount(
        balanceMilliunits, /*currencyDecimalDigits=*/2)
    },
    cleared_transactions: function() {
      return this.account.transactions.cleared || []
    },
    uncleared_transactions: function() {
      return this.account.transactions.uncleared || []
    },
  },
  methods: {
    formatBalance: function(balance) {
      // TODO: move to helper
      // TODO: follow preferences in YNAB account
      const fmt = new Intl.NumberFormat("en-US",
        { style: "currency", currency: "USD" })
      return fmt.format(balance)
    }
  }
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
.currency {
  font-family: $numbers-font-family;
  text-align: right;
  font-size: 22px;
}
.currency .positive {
  color: green;
}
.currency .negative {
  color: red;
}
</style>
