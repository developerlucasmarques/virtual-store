export class SignatureNotInformedError extends Error {
  constructor () {
    super('Signature not informed')
    this.name = 'SignatureNotInformedError'
  }
}
