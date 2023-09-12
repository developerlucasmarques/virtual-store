export class CheckoutFailureError extends Error {
  constructor () {
    super('Failed to checkout')
    this.name = 'CheckoutFailureError'
  }
}
