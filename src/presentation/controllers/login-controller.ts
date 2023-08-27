import type { Auth } from '@/domain/usecases-contracts'
import type { Controller, Validation } from '../contracts'
import { badRequest } from '../helpers/http/http-helpers'
import type { HttpRequest, HttpResponse } from '../http-types/http'

export class LoginController implements Controller {
  constructor (
    private readonly validationComposite: Validation,
    private readonly auth: Auth
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const validations = this.validationComposite.validate(httpRequest.body)
    if (validations.isLeft()) {
      return badRequest(validations.value)
    }
    const { email, password } = httpRequest.body
    const authResult = await this.auth.perform({ email, password })
    if (authResult.isLeft()) {
      return badRequest(authResult.value)
    }
    return { statusCode: 0, body: '' }
  }
}
