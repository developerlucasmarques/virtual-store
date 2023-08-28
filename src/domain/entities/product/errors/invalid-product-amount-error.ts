export class InvalidProductAmount extends Error {
  constructor (amount: number) {
    super(`The product amount '${amount}' is invalid`)
    this.name = 'InvalidProductAmount'
  }
}
