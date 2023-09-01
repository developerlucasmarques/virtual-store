export class InvalidProductQuantityError extends Error {
  constructor () {
    super('Quantity product must be greater than 0')
    this.name = 'InvalidProductQuantityError'
  }
}
