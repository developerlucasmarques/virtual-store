export class MissingStatusError extends Error {
  constructor () {
    super('Status and payment status not informed')
    this.name = 'MissingStatusError'
  }
}
