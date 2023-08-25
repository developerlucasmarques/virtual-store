export class ValidationTypeError extends Error {
  constructor (field: string) {
    super(`The '${field}' is of an invalid type`)
    this.name = 'ValidationTypeError'
  }
}
