<template>
  <div class="md-list-item-content account-summary">
    <md-content class="account-marker md-primary"></md-content>
    <div class="account-info md-list-item-text">
      <span>{{account.name}}</span>
      <span class="md-caption">4 unreconciled transactions</span>
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
    account: Object
  },
  computed: {
    balance: function() {
      const balanceMilliunits = this.account.cleared_balance
      return ynab.utils.convertMilliUnitsToCurrencyAmount(
        balanceMilliunits, /*currencyDecimalDigits=*/2)
    }
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
