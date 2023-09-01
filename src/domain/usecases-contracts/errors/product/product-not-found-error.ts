export class ProductNotFoundError extends Error {
  constructor (id: string) {
    super(`Product with Id '${id}' not found`)
    this.name = 'ProductNotFoundError'
  }
}
