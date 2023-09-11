export class EmptyCartError extends Error {
  constructor () {
    super('Cart is empty')
    this.name = 'EmptyCartError'
  }
}
