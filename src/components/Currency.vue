<template>
  <span class="currency"
    :class="{positive: value >= 0, negative: value < 0}">
    <span v-if="!editable">{{formatted}}</span>
    <md-field v-else class="currency-field">
      <span class="md-prefix">$</span> <!--TODO: use configured currency symbol -->
      <!--TODO: use configured options for v-currency -->
      <md-input id="balance-input" class="currency-input"
        ref="currency" v-model="text" v-autowidth="autowidth"
        v-currency="currency_options"/>
      <md-button v-if="clearable" class="md-icon-button md-dense"
        @click="onClear">
        <md-icon>clear</md-icon>
      </md-button>
    </md-field>
  </span>
</template>

<script>
import { parse } from "vue-currency-input";
const ynab = require("ynab")

function from_milliunits(milliunits) {
  return ynab.utils.convertMilliUnitsToCurrencyAmount(
    milliunits, /*currencyDecimalDigits=*/2)
}

export default {
  name: 'Currency',
  props: {
    value: Number,  // in milliunits

    // Specific to editable currency:
    editable: { type: Boolean, default: false },
    autowidth: Object,
    clearable: { type: Boolean, default: true },
  },
  data() {
    return {
      text: '',
      currency_options: {
        currency: null,
        locale: 'en',
        distractionFree: false,
        allowNegative: true,
        autoDecimalMode: true,
      },
    }
  },
  watch: {
    value: {
      handler(val) {
        this.text = from_milliunits(val).toString()
      },
      immediate: true,
    },
    text: {
      handler(text) {
        const currency = parse(text, this.currency_options)
        const milliunits = currency * 1000
        this.$emit('input', milliunits)
      },
    }
  },
  computed: {
    formatted() {
      const currency = from_milliunits(this.value)
      // TODO: follow preferences in YNAB account
      const fmt = new Intl.NumberFormat("en-US",
        { style: "currency", currency: "USD" })
      return fmt.format(currency)
    },
  },
  methods: {
    onClear() {
      // TODO: this doesn't handle the auto-width properly... Fix.
      this.$emit('reset')
    }
  }
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
.md-icon-button {
  margin: 0;
}
</style>