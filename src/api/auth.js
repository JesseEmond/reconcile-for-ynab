function oauthPath() {
  const clientId = process.env.VUE_APP_YNAB_OAUTH_CLIENT_ID
  if (!clientId) {
    throw Error("Client ID not configured. Make sure to include an " +
      "env variable with name VUE_APP_YNAB_OAUTH_CLIENT_ID based on your YNAB " +
      "OAuth configuration.")
  }
  const redirectUri = process.env.VUE_APP_YNAB_OAUTH_REDIRECT_URI
  if (!redirectUri) {
    throw Error("Redirect URI not configured. Make sure to include an " +
      "env variable with name VUE_APP_YNAB_OAUTH_REDIRECT_URI.")
  }
  return 'https://app.youneedabudget.com/oauth/authorize?' +
    `client_id=${clientId}&redirect_uri=${redirectUri}&` +
    'response_type=token'
}

function tryParseToken(path) {
  const regex = /access_token=([^=&]+)/
  const match = regex.exec(path)
  if (match) {
    const token = match[1]
    return token
  }
  return false
}

export default { oauthPath, tryParseToken }
