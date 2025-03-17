<template>
  <div class="container">
    <div class="header">
      <p class="md-title md-primary">Privacy policy</p>
    </div>
    <div class="details">
      <p class="md-subheading">
        We are not affiliated, associated, or in any way officially connected with YNAB, or any of its subsidiaries or its affiliates.
        We are fans of YNAB and wanted to create a standalone tool to facilitate the reconciliation process and workflow, but this is fully doable in the official YNAB application on its own.
        The official YNAB website can be found at https://www.ynab.com.
        The names YNAB and You Need A Budget as well as related names, marks, emblems and images are registered trademarks of YNAB.
      </p>
      <p class="md-subheading">
        This website is fully client-side. Once you connect to your YNAB account, an access token is stored securely in your browser for a short amount of time and your browser will communicate directly with the YNAB API servers using this token to get your budget information to display it to you, as well as to create or edit transactions to reconcile your accounts.
        Your budget data is not persisted in your browser either. You can revoke this token at any point before its expiration by going in your YNAB settings.
      </p>
      <p class="md-subheading">
        Your data obtained through the YNAB API will not be passed to any third-party.
      </p>
    </div>
    <md-button class="md-raised md-primary"
        @click.native="$router.push('/login')">
        Back to Login
      </md-button>
    <span>
      View source on
      <a href="https://github.com/JesseEmond/reconcile-for-ynab" class="md-accent">GitHub</a>
    </span>
  </div>
</template>

<script>
export default {
  name: 'Privacy',
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
.md-title {
  font-size: 38px;
}
.details {
  max-width: 80%;
  text-align: justify;
}
</style>
