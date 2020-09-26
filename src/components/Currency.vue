<template>
  <span class="currency"
    :class="{positive: value >= 0, negative: value < 0}">
    <span v-if="!editable">{{formatted}}</span>
    <md-field v-else class="currency-field" :class="field_classes">
      <span class="md-prefix">$</span> <!--TODO: use configured currency symbol -->
      <auto-width-input id="balance-input" class="currency-input"
        v-model="text" :autowidth="autowidth" v-currency="currency_options"
        @md-field-classes="field_classes = $event" />
      <md-button v-if="clearable" class="md-icon-button md-dense" @click="onClear">
        <md-icon>clear</md-icon>
      </md-button>
    </md-field>
  </span>
</template>

<script>
import AutoWidthInput from './AutoWidthInput'
import { parse } from "vue-currency-input";
const ynab = require("ynab")

function from_milliunits(milliunits) {
  return ynab.utils.convertMilliUnitsToCurrencyAmount(
    milliunits, /*currencyDecimalDigits=*/2)
}

export default {
  name: 'Currency',
  props: {
    initialValue: Number,  // in milliunits

    // Specific to editable currency:
    editable: { type: Boolean, default: false },
    autowidth: Object,
    clearable: { type: Boolean, default: false },
  },
  components: { AutoWidthInput },
  data() {
    return {
      rawText: '',
      // TODO: use configured ynab options for v-currency
      currency_options: {
        currency: null,
        locale: 'en',
        distractionFree: false,
        allowNegative: true,
        autoDecimalMode: true,
      },
      field_classes: [],
    }
  },
  watch: {
    initialValue: {
      handler(val) {
        this.text = from_milliunits(val).toString()
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
        const currency = parse(text, this.currency_options)
        const milliunits = currency * 1000
        this.$emit('update:value', milliunits)
      },
    },
    value() {
      return parse(this.text, this.currency_options)
    },
    formatted() {
      const currency = from_milliunits(this.initialValue)
      // TODO: follow preferences in YNAB account
      const fmt = new Intl.NumberFormat("en-US",
        { style: "currency", currency: "USD" })
      return fmt.format(currency)
    },
  },
  methods: {
    onClear() {
      this.$emit('reset')
    },
  },
}
</script>

<style lang="scss" scoped>
$positive-color: green;
$negative-color: red;

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