const ynab = require("ynab");

async function get_access_token() {
  return dev_login() ?? oauth_login();
}

function oauth_login() {
  // TODO: use proper OAuth flow on https://api.youneedabudget.com/#outh-applications
  throw Error("OAuth not implemented yet. Use the dev flow.");
}

function dev_login() {
  return process.env.VUE_APP_YNAB_PERSONAL_ACCESS_TOKEN_KEEP_PRIVATE;
}

export default {
  get_api: async function() {
    const access_token = await get_access_token();
  return new ynab.API(access_token);
  }
}