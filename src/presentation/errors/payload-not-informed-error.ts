export class PayloadNotInformedError extends Error {
  constructor () {
    super('Payload not informed')
    this.name = 'PayloadNotInformedError'
  }
}
