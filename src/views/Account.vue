<template>
  <div class="container">
    <p class="account-name md-title">{{account.name}}</p>
    <currency id="balance" class="balance" ref="balance" editable
      :initial-value="initialBalance" @update:value="currentBalance = $event"
      :autowidth="{maxWidth: '100%', minWidth: '100px', comfortZone: 25}"
      :clearable="currentBalance != serverBalance">
    </currency>
    <div :style="{visibility: reconciliationTransaction != 0 ? 'visible' : 'hidden'}">
      <md-icon class="md-accent">info</md-icon>
      <span class="md-subheading">
        A reconciliation transaction of 
        <currency :initialValue="reconciliationTransaction"></currency>
        will be created.
      </span>
    </div>
    <div class="transactions">
      <md-content class="transactions-list md-scrollbar md-elevation-4">
        <div v-if="transactions && !submitting">
          <transaction-list :cleared="transactions.cleared" :uncleared="transactions.uncleared"
            @selected="selectedTransactions = $event">
          </transaction-list>
        </div>
        <!-- TODO: loading during reconciliation -->
        <!-- TODO: show error on failed transaction creation -->
        <!-- TODO: show error on failed transaction update -->
        <div class="loader-container" v-else>
          <span class="md-title">Loading transactions...</span>
          <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
        </div>
      </md-content>
      <p :style="{visibility: selectedTransactions.length ? 'visible' : 'hidden'}">
        <md-icon class="md-accent">info</md-icon>
        <span class="md-subheading">
          {{selectedTransactions.length}}
          {{pluralize('transaction', selectedTransactions.length)}}
          will be marked as reconciled.
        </span>
      </p>
    </div>
    <div class="actions-area">
      <md-button to="/">Cancel</md-button>
      <span>
        <md-button class="md-raised md-primary" @click="reconcile"
          :disabled="!needsReconciliation">
          Reconcile
        </md-button>
        <md-tooltip>{{reconcileTooltip}}</md-tooltip>
      </span>
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
      initialBalance: null,
      currentBalance: null,
      selectedTransactions: [],
    }
  },
  computed: {
    account() {
      const {budget, tracking} = this.store.state.accounts
      const budgetAccount = budget.find(acc => acc.id == this.id)
      return budgetAccount ?? tracking.find(acc => acc.id == this.id)
    },
    transactions() {
      return this.account.transactions
    },
    submitting() {
      return this.store.state.reconciling
    },
    needsReconciliation() {
      return this.selectedTransactions.length > 0 || this.reconciliationTransaction != 0
    },
    serverBalance() {
      return this.account.cleared_balance
    },
    reconciliationTransaction() {
      return this.currentBalance - this.serverBalance 
    },
    reconcileTooltip() {
      if (this.needsReconciliation) {
        return "Reconcile on YNAB."
      } else {
        return "Nothing to reconcile."
      }
    },
  },
  watch: {
    store: {
      handler() {
        this.initialBalance = this.serverBalance
        this.currentBalance = this.initialBalance
      },
      deep: true,
      immediate: true,
    }
  },
  components: { Currency, TransactionList },
  methods: {
    reconcile: async function() {
      await this.store.reconcile(this.account,
        this.selectedTransactions, this.reconciliationTransaction)
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
.account-name {
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
  overflow-y: auto;
}
.actions-area {
  align-items: flex-end;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  width: 90%;
}
.loader-container {
  flex-direction: column;
  align-items: center;
  display: flex;
  height: 100%;
  .md-title {
    margin-top: 5vh;
    font-size: 30px;
    margin-bottom: 5vh;
  }
}
</style>