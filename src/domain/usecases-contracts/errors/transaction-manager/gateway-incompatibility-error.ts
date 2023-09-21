export class GatewayIncompatibilityError extends Error {
  constructor (stack: any) {
    super('Gateway Incompatibility Error')
    this.name = 'GatewayIncompatibilityError'
    this.stack = stack
  }
}
