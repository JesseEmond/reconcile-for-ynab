<template>
  <span class="currency"
    :class="{positive: value >= 0, negative: value < 0}">
    <span v-if="!editable">{{formatValue(initialValue, /*showCurrency=*/true)}}</span>
    <md-field v-else class="currency-field" :class="fieldClasses">
      <span class="md-prefix" v-if="showLeftCurrency">{{currencySymbol}}</span>
      <auto-width-input id="balance-input" class="currency-input"
        v-model="text" :autowidth="autowidth" v-currency="currencyOptions"
        @md-field-classes="fieldClasses = $event" />
      <md-button v-if="clearable" class="md-icon-button md-dense" @click="onClear">
        <md-icon>clear</md-icon>
      </md-button>
      <span class="md-prefix" v-if="showRightCurrency">{{currencySymbol}}</span>
    </md-field>
  </span>
</template>

<script>
import AutoWidthInput from './AutoWidthInput'
import budgetsApi from "../api/budgets"
import { parse } from "vue-currency-input";
const ynab = require("ynab")

function fromMilliunits(milliunits, decimalDigits) {
  return ynab.utils.convertMilliUnitsToCurrencyAmount(
    milliunits, /*currencyDecimalDigits=*/decimalDigits)
}

export default {
  name: 'Currency',
  props: {
    initialValue: Number,  // in milliunits

    settings: Object,  // From YNAB

    // Specific to editable currency:
    editable: { type: Boolean, default: false },
    autowidth: Object,
    clearable: { type: Boolean, default: false },
  },
  components: { AutoWidthInput },
  data() {
    return {
      rawText: '',
      currencyOptions: {
        currency: null,  // We display the currency symbol ourselves
        precision: this.settings.currency_format.decimal_digits,
        exportValueAsInteger: true,
        distractionFree: false,
        allowNegative: true,
        autoDecimalMode: true,
      },
      fieldClasses: [],
    }
  },
  watch: {
    initialValue: {
      handler(val) {
        this.text = this.formatValue(val, /*showCurrency=*/false)
      },
      immediate: true,
    },
  },
  computed: {
    text: {
      get() {
        return this.rawText
      },
      set(text) {
        this.rawText = text
        const currency = parse(text, this.currencyOptions)
        const milliunits = currency * 1000
        this.$emit('update:value', milliunits)
      },
    },
    value() {
      return parse(this.text, this.currencyOptions)
    },
    showLeftCurrency() {
      return this.settings.currency_format.display_symbol && this.settings.currency_format.symbol_first
    },
    showRightCurrency() {
      return this.settings.currency_format.display_symbol && !this.settings.currency_format.symbol_first
    },
    currencySymbol() {
      return this.settings.currency_format.currency_symbol
    },
  },
  methods: {
    formatValue(milliunits, showCurrency) {
      const iso_code = this.settings.currency_format.iso_code
      const decimalDigits = this.settings.currency_format.decimal_digits
      const currency = fromMilliunits(milliunits, decimalDigits)
      let options = {};
      if (showCurrency && this.settings.currency_format.display_symbol) {
        options = { style: "currency", currency: iso_code, currencyDisplay: "narrowSymbol" }
      } else {
        options = { style: "decimal", minimumFractionDigits: decimalDigits }
      }
      const fmt = new Intl.NumberFormat(budgetsApi.getLocale(this.settings), options)
      return fmt.format(currency)
    },
    onClear() {
      this.text = this.formatValue(this.initialValue, false)
    },
  },
}
</script>

<style lang="scss" scoped>
$positive-color: #4caf50;
$negative-color: #ff5252;

.currency {
  font-family: $numbers-font-family;
}
.positive {
  color: $positive-color;
  #balance-input {
    -webkit-text-fill-color: $positive-color;
  }
}
.negative {
  color: $negative-color;
  #balance-input {
    -webkit-text-fill-color: $negative-color;
  }
}
#balance-input {
  padding-right: 5px;
}
.md-icon-button {
  margin: 0;
}
</style>