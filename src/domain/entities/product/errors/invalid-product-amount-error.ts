export class InvalidProductAmountError extends Error {
  constructor (amount: number) {
    super(`The product amount '${amount}' is invalid`)
    this.name = 'InvalidProductAmountError'
  }
}
