import type { Controller, Validation } from '../contracts'
import { badRequest } from '../helpers/http/http-helpers'
import type { HttpRequest, HttpResponse } from '../http-types/http'

export class LoginController implements Controller {
  constructor (private readonly validationComposite: Validation) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const validations = this.validationComposite.validate(httpRequest.body)
    if (validations.isLeft()) {
      return badRequest(validations.value)
    }
    return { statusCode: 0, body: '' }
  }
}
