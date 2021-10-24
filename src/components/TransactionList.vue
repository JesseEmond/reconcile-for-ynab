<template>
  <div>
    <md-table id="transactions" md-card
      v-if="transactions.length"
      v-model="transactions" :md-selected-value.sync="selected">
      <md-table-toolbar>
        <h1 class="md-title">Transactions to reconcile</h1>
      </md-table-toolbar>

      <md-table-row slot="md-table-row" slot-scope="{ item }"
        md-selectable="multiple" md-auto-select>
        <md-table-cell md-label="Payee">{{ item.payee_name }}</md-table-cell>
        <md-table-cell md-label="Date">{{ formatDate(item.date) }}</md-table-cell>
        <md-table-cell md-label="Amount">
          <currency :initialValue="item.amount" :settings="settings"></currency>
        </md-table-cell>
        <md-table-cell md-label="Cleared"
          :class="{cleared: item.cleared == 'cleared'}">
          <md-icon class="cleared-txn" v-if="item.cleared == 'cleared'">check_circle</md-icon>
          <md-icon class="cleared-txn" v-else>cancel</md-icon>
        </md-table-cell>
      </md-table-row>
    </md-table>
    <md-empty-state v-else
      class="md-primary" md-icon="done" md-label="No transactions to reconcile"
      md-description="New transactions you add will show up here.">
    </md-empty-state>
  </div>
</template>

<script>
const ynabApi = require("ynab");
import budgetsApi from "../api/budgets"
import Currency from './Currency'

export default {
  name: 'TransactionList',
  props: {
    cleared: Array,
    uncleared: Array,
    settings: Object,
  },
  components: { Currency },
  data() {
   return {
    transactions: [],
    selected: [],
   }
  },
  watch: {
    selected(value) {
      this.$emit('selected', value)
    },
    immediate: true,
  },
  created() {
    this.transactions = [...this.cleared, ...this.uncleared]
    this.selected = [...this.cleared]
  },
  methods: {
    formatDate(dateStr) {
      const date = ynabApi.utils.convertFromISODateString(dateStr)
      const options = { day: "numeric", month: "short" }
      // Display based on locale instead of YNAB's configured date format, since we want
      // very short dates liek "Oct 23" as opposed to full ones like "DD-MM-YYYY".
      const format = new Intl.DateTimeFormat(budgetsApi.getLocale(this.settings), options)
      return format.format(date)
    },
  },
}
</script>

<style lang="scss">
#transactions {
  .md-table-head-label, .md-table-cell-container {
    padding-left: 4px;
    padding-right: 4px;
  }
  margin: 0;
}
</style>
<style lang="scss" scoped>
.md-table-toolbar {
  text-align: center;  
}
.md-empty-state {
  height: 256px;
}
.cleared {
  .md-icon-font {
    color: #4caf50;
  }
}
</style>