<template>
  <div class="container">
    <p class="md-title">{{account.name}}</p>
    <currency id="balance" class="balance" editable
      :initial-value="initial_balance" @update:value="current_balance = $event"
      :autowidth="{maxWidth: '100%', minWidth: '100px', comfortZone: 25}"
      :clearable="current_balance != server_balance" @reset="onReset">
    </currency>
    <div :style="{visibility: reconciliation_transaction != 0 ? 'visible' : 'hidden'}">
      <md-icon class="md-primary">info</md-icon>
      <span class="md-subheading">
        A reconciliation transaction of 
        <currency :initialValue="reconciliation_transaction"></currency>
        will be created.
      </span>
    </div>
    <div class="transactions">
      <transaction-list v-if="transactions && !submitting" class="transactions-list md-elevation-4"
        :cleared="transactions.cleared" :uncleared="transactions.uncleared"
        @selected="selected_transactions = $event">
      </transaction-list>
      <!-- TODO: show summary of changes that will happen -->
      <!-- TODO: when there are no transactions? -->
      <p class="md-subheading" v-else>
        Loading transactions...
      </p>
    </div>
    <div class="actions-area">
      <md-button to="/">Cancel</md-button>
      <md-button class="md-raised md-primary" @click="reconcile">Reconcile</md-button>
    </div>
  </div>
</template>

<script>
import Currency from '../components/Currency'
import TransactionList from '../components/TransactionList'

export default {
  name: 'Account',
  props: {
    store: Object,
    id: String,
  },
  data() {
    return {
      initial_balance: null,
      current_balance: null,
      selected_transactions: [],
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
    submitting() {
      return this.store.state.reconiling
    },
    server_balance() {
      return this.account.cleared_balance
    },
    reconciliation_transaction() {
      return this.current_balance - this.server_balance 
    },
  },
  components: { Currency, TransactionList },
  created() {
    // TODO: on load, refresh this account's info from API?
    this.initial_balance = this.server_balance
  },
  methods: {
    onReset() {
      this.initial_balance = this.server_balance
    },
    reconcile: async function() {
      await this.store.reconcile(this.account,
        this.selected_transactions, this.reconciliation_transaction)
      if (!this.store.state.error) {
        this.$router.push('/')
      }
    },
  },
}
</script>

<style lang="scss">
#balance {
  .currency-field.md-field {
    font-size: 64px;
  }
  .md-button {
    top: 10px;
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
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}
.md-title {
  margin-top: 25px;
  font-size: 40px;
  margin-bottom: 5px;
}
.balance {
  max-width: 100%;
}
.transactions {
  padding-top: 8px;
  flex-grow: 1;
  width: 100%;
}
.transactions-list {
  height: 45vh;
}
.actions-area {
  align-items: flex-end;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  width: 90%;
}
</style>