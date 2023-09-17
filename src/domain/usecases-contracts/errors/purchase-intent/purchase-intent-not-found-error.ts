export class PurchaseIntentNotFoundError extends Error {
  constructor (id: string) {
    super(`Purchase Intent with Id '${id}' not found`)
    this.name = 'PurchaseIntentNotFoundError'
    this.stack = `Purchase Intent with Id '${id}' not found`
  }
}
