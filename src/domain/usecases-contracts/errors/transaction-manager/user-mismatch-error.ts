export class UserMismatchError extends Error {
  constructor () {
    super('User mismatch error')
    this.name = 'UserMismatchError'
  }
}
