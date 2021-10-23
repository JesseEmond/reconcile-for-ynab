async function getSettings(ynab) {
  try {
    const response = await ynab.budgets.getBudgetSettingsById("default")
    return response.data.settings
  } catch (err) {
    const detail = err.error.detail
    throw Error(`Error while fetching budget settings from YNAB: ${detail}`)
  }
}

// Return BCP 47 language tag. Note that this is currently hard-coded and not really fetched
// from settings.
function getLocale() {
  // Unfortunately we do not get a locale from YNAB settings, only data/currency details.
  // Choosing to use fixed en-US to have a format like "Oct 23" for dates and some default for
  // currency editing. Alternatively, could add an app setting to specify locale.
  return "en-US"
}


export default { getSettings, getLocale }