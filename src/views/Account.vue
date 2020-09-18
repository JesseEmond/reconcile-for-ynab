<template>
  <div class="container">
    <p class="md-title">{{account.name}}</p>
    <currency id="balance" class="balance" editable v-model="balance"
      :autowidth="{maxWidth: '90%', minWidth: '100px', comfortZone: 10}" />
    <!--<div>TODO warning when diff balance that this will create transaction</div>-->
    <p class="transactions-summary md-subheading">
      <span v-if="transactions">
        {{transactions.cleared.length}} cleared (to reconcile),
        {{transactions.uncleared.length}} uncleared transactions
      </span>
      <span v-else>
        Loading transactions...
      </span>
    </p>
    <div class="actions-area">
      <!-- TODO implement actions -->
      <md-button>Cancel</md-button>
      <md-button class="md-raised md-primary">Reconcile</md-button>
    </div>
  </div>
</template>

<script>
import Currency from '../components/Currency'

export default {
  name: 'Account',
  props: {
    store: Object,
    id: String,
  },
  data() {
    return {
      balance: 0,
    }
  },
  computed: {
    account() {
      const {budget, tracking} = this.store.state.accounts
      const budget_account = budget.find(acc => acc.id == this.id)
      return budget_account ?? tracking.find(acc => acc.id == this.id)
    },
    transactions() {
      return this.account.transactions
    },
  },
  components: {
    Currency,
  },
  created() {
    // TODO: on load, refresh this account's info from API?
    this.balance = this.account.cleared_balance
  },
  methods: {
  },
}
</script>

<style lang="scss">
#balance {
  .currency-field.md-field {
    font-size: 64px;
  }
  .md-input-action {
    top: 30px;
  }
  .md-prefix {
    font-size: 40px;
  }
  .currency-input.md-input {
    height: 64px;
    font-size: 64px;
    line-height: initial;
  }
}
</style>

<style lang="scss" scoped>
.container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}
.md-title {
  font-size: 40px;
  margin-top: 10vh;
  margin-bottom: 10px;
}
.transactions-summary {
  margin-top: 5vh;
  flex-grow: 1;
}
.balance {
  max-width: 90%;
}
.actions-area {
  align-items: flex-end;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  width: 90%;
}
</style>