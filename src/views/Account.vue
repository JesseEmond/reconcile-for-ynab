<template>
  <div class="container">
    <p class="md-title">{{account.name}}</p>
    <currency id="balance" class="balance" ref="balance" editable
      :initial-value="initial_balance" @update:value="current_balance = $event"
      :autowidth="{maxWidth: '100%', minWidth: '100px', comfortZone: 25}"
      :clearable="current_balance != server_balance">
    </currency>
    <div :style="{visibility: reconciliation_transaction != 0 ? 'visible' : 'hidden'}">
      <md-icon class="md-accent">info</md-icon>
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
      <!-- TODO: loading during reconciliation -->
      <!-- TODO: show error on failed transaction creation -->
      <!-- TODO: show error on failed transaction update -->
      <p class="md-subheading" v-else>
        Loading transactions...
      </p>
      <p :style="{visibility: selected_transactions.length ? 'visible' : 'hidden'}">
        <md-icon class="md-accent">info</md-icon>
        <span class="md-subheading">
          {{selected_transactions.length}}
          {{pluralize('transaction', selected_transactions.length)}}
          will be marked as reconciled.
        </span>
      </p>
    </div>
    <div class="actions-area">
      <md-button to="/">Cancel</md-button>
      <md-button class="md-raised md-primary" @click="reconcile"
        :disabled="!needs_reconciliation">
        Reconcile
        <!-- TODO: test that out -->
        <md-tooltip :md-active="!needs_reconciliation">Nothing to reconcile.</md-tooltip>
      </md-button>
    </div>
  </div>
</template>

<script>
// TODO: hitting refresh from here doesn't load currency with right amount.
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
    needs_reconciliation() {
      return this.selected_transactions.length > 0 || this.reconciliation_transaction != 0
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
    this.current_balance = this.initial_balance
  },
  methods: {
    reconcile: async function() {
      await this.store.reconcile(this.account,
        this.selected_transactions, this.reconciliation_transaction)
      if (!this.store.state.error) {
        this.$router.push('/')
      }
    },
    pluralize(msg, count) {
      return count > 1 ? msg + 's' : msg
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
  margin-top: 35px;
  font-size: 40px;
  margin-bottom: 5px;
}
.balance {
  max-width: 100%;
}
.transactions {
  padding-top: 30px;
  flex-grow: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.transactions-list {
  height: 40vh;
  width: 95%;
}
.actions-area {
  align-items: flex-end;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  width: 90%;
}
</style>