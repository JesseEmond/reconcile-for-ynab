<template>
  <div class="account-summary md-list-item-content">
    <md-content class="account-marker md-primary"></md-content>
    <div class="account-info md-list-item-text">
      <span>Account name</span>
      <span>4 unreconciled transactions</span>
    </div>
    <div class="currency md-list-item-text">
      <span>$2215.13</span>
    </div>
    <md-icon>chevron_right</md-icon>
  </div>
</template>

<script>
export default {
  name: 'AccountSummary',
  props: {
    account: Object
  }
}
</script>

<style>
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
  flex: 3;
}
.currency {
  text-align: right;
}
</style>
