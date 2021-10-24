<template>
  <div class="container">
    <div class="header">
      <p class="md-title md-primary">Privacy policy</p>
    </div>
    <div class="details">
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