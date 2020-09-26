<template>
  <div class="page-container">
    <md-app md-mode="fixed" id="app">
      <md-app-toolbar class="md-primary">
        <!-- TODO use icons? "back" button? -->
        <!-- TODO: click title brings you to home -->
        <span class="md-title">YNAB Reconcile</span>
      </md-app-toolbar>

      <md-app-content>
        <router-view :store="store" />
      </md-app-content>
    </md-app>
  </div>
</template>

<script>
import store from './store'
export default {
  data: function() {
    return {
      store: store
    };
  }
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
.md-app-content {
  display: flex;
  padding-left: 0;
  padding-right: 0;
}
</style>
