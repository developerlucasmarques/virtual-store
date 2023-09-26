export class OrderNotFoundError extends Error {
  constructor (id: string) {
    super(`Order with Id '${id}' not found`)
    this.name = 'OrderNotFoundError'
  }
}
