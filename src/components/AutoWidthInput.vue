<!-- Note: not using md-input here to play nice with v-autowidth updates.
  Otherwise, the width would not update on 'value' change because of weird
  interactions between the v-autowidth directive and md-input's implementation.
  This styles an regular input autowidth similarly to a md-input. -->

<template>
  <input class="md-input md-has-value" type="text"
    v-model="text" v-autowidth="autowidth"
    @focus="focused = true" @blur="focused = false">
</template>

<script>
export default {
  name: 'AutoWidthInput',
  props: {
    value: String,
    autowidth: Object,
  },
  data() {
    return {
      model: "",
      focused: false,
    }
  },
  computed: {
    text: {
      get() {
        return this.model
      },
      set(value) {
        this.model = value
        this.$emit('input', value)
      }
    }
  },
  watch: {
    value: {
      handler(val) {
        this.model = val;
      },
      immediate: true,
    },
    focused: {
      handler() {
        this.updateClasses()
      },
      immediate: true,
    },
  },
  methods: {
    updateClasses() {
      let classes = ['md-has-value']
      if (this.focused) {
        classes.push('md-focused')
      }
      this.$emit('md-field-classes', classes)
    },
  },
}
</script>

<style lang="scss" scoped>

</style>