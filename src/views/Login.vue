<template>
  <p>Login.</p>
</template>

<script>
import store from '../store'
import auth from '../api/auth'

export default {
  name: 'Login',
  mounted: async function() {
    store.ynab = await auth.get_api()
    // TODO use local storage?
    console.log("LOGGED IN!") // TODO do proper oauth flow here
    this.$router.push('/')
  }
}
</script>