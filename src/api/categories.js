import { YnabCache } from "./ynab_cache"
let cache = new YnabCache()


async function getCategoryGroups(ynab) {
  try {
    const response = await ynab.categories.getCategories("default", cache.last_knowledge)
    cache.processDelta(response.data.category_groups, response.data.server_knowledge)
    return cache.items
  } catch(err) {
    const detail = err.error.detail
    throw Error(`Error while fetching category groups from YNAB: ${detail}`)
  }
}

async function getInflowCategory(ynab) {
  const groups = await getCategoryGroups(ynab)
  const internal = groups.find(grp => grp.name == "Internal Master Category")
  if (!internal)
    throw Error(`No 'Internal Master Category' found on groups: ${groups.map(g => g.name)}`)
  const inflow = internal.categories.find(ctg => ctg.name.includes("Inflow"))
  if (!inflow)
    throw Error(`No 'Inflow' found in categories: ${internal.categories.map(c => c.name)}`)
  return inflow
}

export default { getInflowCategory }