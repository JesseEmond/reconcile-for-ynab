<template>
  <p>Login.</p>
</template>

<script>
import auth from '../api/auth'

export default {
  name: 'Login',
  props: {
    store: Object
  },
  mounted: async function() {
    this.store.ynab = await auth.get_api()
    // TODO use local storage?
    console.log("LOGGED IN!") // TODO do proper oauth flow here
    this.$router.push('/')
  }
}
</script>