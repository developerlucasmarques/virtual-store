import type { Auth } from '@/domain/usecases-contracts'
import type { Controller, Validation } from '../contracts'
import { badRequest, ok, serverError, unauthorized } from '../helpers/http/http-helpers'
import type { HttpRequest, HttpResponse } from '../http-types/http'
import { InvalidEmailError } from '@/domain/entities/user/errors'

export class LoginController implements Controller {
  constructor (
    private readonly validationComposite: Validation,
    private readonly auth: Auth
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validations = this.validationComposite.validate(httpRequest.body)
      if (validations.isLeft()) {
        return badRequest(validations.value)
      }
      const { email, password } = httpRequest.body
      const authResult = await this.auth.perform({ email, password })
      if (authResult.isLeft()) {
        if (authResult.value instanceof InvalidEmailError) {
          return badRequest(authResult.value)
        }
        return unauthorized(authResult.value)
      }
      return ok({ accessToken: authResult.value.accessToken })
    } catch (error: any) {
      console.error(error)
      return serverError(error)
    }
  }
}
