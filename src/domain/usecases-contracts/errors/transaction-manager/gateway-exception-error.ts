export class GatewayExceptionError extends Error {
  constructor (stack: any) {
    super('Gateway Exception Error')
    this.name = 'GatewayExceptionError'
    this.stack = stack
  }
}
