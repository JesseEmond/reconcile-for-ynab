<template>
  <div class="page-container">
    <md-app md-mode="fixed" id="app">
      <md-app-toolbar>
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

<style>
@import url("https://fonts.googleapis.com/css?family=Material+Icons");
@import url("https://fonts.googleapis.com/css?family=Roboto+Condensed:300,400,500,700,400italic");
@import url("https://fonts.googleapis.com/css?family=Eczar:300,400,500,700,400italic");

#app {

}
.md-app-content {
  padding-left: 0;
  padding-right: 0;
}
</style>
