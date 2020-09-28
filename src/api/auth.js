// TODO: check JS naming conventions and apply everywhere...

function oauth_path() {
  const client_id = process.env.VUE_APP_YNAB_OAUTH_CLIENT_ID
  if (!client_id) {
    throw Error("Client ID not configured. Make sure to include an " +
      "env variable with name VUE_APP_YNAB_OAUTH_CLIENT_ID based on your YNAB " +
      "OAuth configuration.")
  }
  const redirect_uri = process.env.VUE_APP_YNAB_OAUTH_REDIRECT_URI
  if (!redirect_uri) {
    throw Error("Redirect URI not configured. Make sure to include an " +
      "env variable with name VUE_APP_YNAB_OAUTH_REDIRECT_URI.")
  }
  return 'https://app.youneedabudget.com/oauth/authorize?' +
    `client_id=${client_id}&redirect_uri=${redirect_uri}&` +
    'response_type=token'
}

function try_parse_token(path) {
  const regex = /access_token=([0-9a-zA-Z]+)/
  const match = regex.exec(path)
  if (match) {
    const token = match[1]
    return token
  }
  return false
}

export default { oauth_path, try_parse_token }