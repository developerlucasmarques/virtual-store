export class InvalidIdError extends Error {
  constructor (id: string) {
    super(`Id '${id}' is invalid`)
    this.name = 'InvalidIdError'
  }
}
