export class InvalidProductNameError extends Error {
  constructor (name: string) {
    super(`The product name '${name}' is invalid`)
    this.name = 'InvalidProductNameError'
  }
}
