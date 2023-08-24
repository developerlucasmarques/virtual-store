import type { Validation, Controller } from '../contracts'
import { badRequest } from '../helpers/http/http-helpers'
import type { HttpRequest, HttpResponse } from '../http-types/http'

export class SignUpController implements Controller {
  constructor (
    private readonly validationComposite: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const validation = this.validationComposite.validate(httpRequest.body)
    if (validation.isLeft()) {
      return badRequest(validation.value)
    }
    return await Promise.resolve({
      body: '',
      statusCode: 0
    })
  }
}
