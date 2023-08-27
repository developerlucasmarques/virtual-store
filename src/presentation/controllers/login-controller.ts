import type { Controller, Validation } from '../contracts'
import type { HttpRequest, HttpResponse } from '../http-types/http'

export class LoginController implements Controller {
  constructor (private readonly validationComposite: Validation) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    this.validationComposite.validate(httpRequest.body)
    return { statusCode: 0, body: '' }
  }
}
