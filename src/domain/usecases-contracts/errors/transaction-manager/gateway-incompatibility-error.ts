export class GatewayIncompatibilityError extends Error {
  constructor () {
    super('Gateway Incompatibility Error')
    this.name = 'GatewayIncompatibilityError'
  }
}
