<template>
  <div class="page-container">
    <md-app md-mode="fixed" id="app">
      <md-app-toolbar class="md-primary">
        <span class="md-title" @click="onHeaderClick">Reconcile for YNAB</span>
        <div v-if="store.isLoggedIn()"
          class="md-toolbar-section-end">
          <md-button @click="refresh" class="md-icon-button">
            <md-icon>refresh</md-icon>
          </md-button>
          <md-menu md-size="small">
            <md-button md-menu-trigger class="md-icon-button">
              <md-icon>more_vert</md-icon>
            </md-button>
            <md-menu-content>
              <md-menu-item @click="logout">Logout</md-menu-item>
            </md-menu-content>
          </md-menu>
        </div>
      </md-app-toolbar>

      <md-app-content class="md-layout">
        <div class="md-layout-item md-size-25 md-small-hide"></div>
        <div class="md-layout-item md-size-50 md-small-size-100">
          <router-view :store="store"></router-view>
        </div>

         <md-snackbar class="error"
            :md-duration="Infinity" :md-active.sync="store.state.showError">
            <span>Error encountered. {{store.state.error}}</span>
            <md-button class="md-accent" v-if="store.state.errorRetryFn" @click="errorRetry">Retry</md-button>
            <md-button class="md-accent" v-else @click="dismissError">Dismiss</md-button>
          </md-snackbar>
      </md-app-content>
    </md-app>
  </div>
</template>

<script>
import store from './store'
export default {
  data() {
    return {
      store: store
    };
  },
  methods: {
    onHeaderClick() {
      this.$router.push('/')
    },
    logout() {
      this.store.logout()
      this.$router.push('/login')
    },
    refresh() {
      this.store.reload()
    },
    errorRetry() {
      this.store.state.errorRetryFn()
    },
    dismissError() {
      this.store.ok()
    },
  },
}
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Material+Icons");
@import url("https://fonts.googleapis.com/css?family=Roboto+Condensed:300,400,500,700,400italic");
@import url("https://fonts.googleapis.com/css?family=Eczar:300,400,500,700,400italic");

@import "~vue-material/dist/theme/engine"; // Import the theme engine

@include md-register-theme("default", (
  primary: #344955,
  accent: #2196f3,
));

@import "~vue-material/dist/theme/all"; // Apply the theme

#app {
  font-family: $text-font-family;
  min-height: 100vh;
}
</style>

<style lang="scss" scoped>
.md-app-content {
  display: flex;
  padding-left: 0;
  padding-right: 0;
}
.error .md-button {
  width: 150px;
}
</style>
