const ynab = require("ynab");

async function get_access_token() {
  return dev_login() ?? oauth_login();
}

function oauth_login() {
  // TODO: use proper OAuth flow on https://api.youneedabudget.com/#outh-applications
  throw Error("OAuth not implemented yet. Use the dev flow.");
}

function dev_login() {
  const access_token = process.env.VUE_APP_YNAB_PERSONAL_ACCESS_TOKEN_KEEP_PRIVATE
  if (access_token) {
    console.log("Using dev personal access token.")
  }
  return access_token
}

export default {
  get_api: async function() {
    const access_token = await get_access_token();
    return new ynab.API(access_token);
  }
}