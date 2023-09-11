export class ProductNotAvailableError extends Error {
  constructor (id: string) {
    super(`Product with Id '${id}' not available`)
    this.name = 'ProductNotAvailableError'
  }
}
