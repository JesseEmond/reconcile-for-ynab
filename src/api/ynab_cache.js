// Helper class to manage delta updates based on last_knowledge_of_server.
export class YnabCache {
  constructor(verbose) {
    this.last_knowledge = -1
    this.items = []
    this.verbose = verbose || false
  }

  processDelta(delta, knowledge) {
    if (this.verbose) {
      console.info(`Processing a delta of ${delta.length}, knowledge ${this.last_knowledge}->${knowledge}`)
    }
    this.last_knowledge = knowledge
    for (const item of delta) {
      const index = this.items.findIndex(i => i.id == item.id)
      if (index < 0) {
        this.items.push(item)
      } else {
        this.items.splice(index, 1, item)
      }
    }
  }
}