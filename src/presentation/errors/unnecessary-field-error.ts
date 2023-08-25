export class UnnecessaryFieldError extends Error {
  constructor (field: string) {
    super(`The '${field}' field is unnecessary, inform only required fields`)
    this.name = 'UnnecessaryFieldError'
  }
}
