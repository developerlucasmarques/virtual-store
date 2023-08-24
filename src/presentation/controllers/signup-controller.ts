import type { Validation, Controller } from '../contracts'
import type { HttpRequest, HttpResponse } from '../http-types/http'

export class SignUpController implements Controller {
  constructor (
    private readonly validationComposite: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    this.validationComposite.validate(httpRequest.body)
    return await Promise.resolve({
      body: '',
      statusCode: 0
    })
  }
}
