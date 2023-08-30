export class InvalidParamsError extends Error {
  constructor (paramName: string) {
    super(`Invalid params: ${paramName}`)
    this.name = 'InvalidParamsError'
  }
}
