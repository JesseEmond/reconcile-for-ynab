<template>
  <div class="container">
    <div class="header">
      <md-icon class="md-size-5x md-primary">account_balance</md-icon>
      <p class="md-title md-primary">Reconcile your accounts</p>
      <md-button class="md-raised md-primary" :href="oauth_url">Connect to YNAB</md-button>
    </div>
    <div class="details">
      <p class="md-subheading">
        Quickly bring your accounts up-to-date, even on mobile. Your data stays on YNAB.
      </p>
    </div>
    <span>
      Made with <md-icon class="md-accent">favorite</md-icon>,
      code on <a href="TODO github link" class="md-accent">GitHub</a>
    </span>
  </div>
</template>

<script>
// TODO: proper link to github
import auth from '../api/auth'

export default {
  name: 'Login',
  props: {
    store: Object
  },
  computed: {
    oauth_url() {
      return auth.oauth_path()
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
}
.md-button {
  padding-left: 20px;
  padding-right: 20px;
}
.header {
  min-height: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  .md-title {
    font-size: 38px;
  }
}
.details {
  min-height: 25%;
  max-width: 80%;
  text-align: center;
}
</style>