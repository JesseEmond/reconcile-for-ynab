<template>
  <div class="container">
    <div class="header">
      <img class="icon" src="img/icons/android-chrome-192x192.png">
      <p class="md-title md-primary">Reconcile your accounts</p>
      <md-button class="md-raised md-primary" :href="oauthUrl">Connect to YNAB</md-button>
    </div>
    <div class="details">
      <p class="md-subheading">
        Quickly bring your accounts up-to-date, even on mobile. Your data stays between your browser and YNAB.
      </p>
      <div><router-link class="md-accent" to="/privacy">Privacy policy</router-link></div>
    </div>
    <span>
      Made with <md-icon class="md-accent">favorite</md-icon>,
      code on <a href="https://github.com/JesseEmond/ynab-reconcile" class="md-accent">GitHub</a>
    </span>
  </div>
</template>

<script>
import auth from '../api/auth'

export default {
  name: 'Login',
  props: {
    store: Object
  },
  computed: {
    oauthUrl() {
      return auth.oauthPath()
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
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
.icon {
  width: 120px;
  height: 120px;
  margin: auto;
}
</style>