export class InvalidProductDescriptionError extends Error {
  constructor (description: string) {
    super(`The product description '${description}' is invalid`)
    this.name = 'InvalidProductDescriptionError'
  }
}
