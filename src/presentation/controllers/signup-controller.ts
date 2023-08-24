import type { AddUser } from '@/domain/usecases'
import type { Controller, Validation } from '../contracts'
import { badRequest, created, serverError } from '../helpers/http/http-helpers'
import type { HttpRequest, HttpResponse } from '../http-types/http'

export class SignUpController implements Controller {
  constructor (
    private readonly validationComposite: Validation,
    private readonly addUser: AddUser
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validation = this.validationComposite.validate(httpRequest.body)
      if (validation.isLeft()) {
        return badRequest(validation.value)
      }
      const { name, email, password } = httpRequest.body
      const addUserResult = await this.addUser.perform({ name, email, password })
      if (addUserResult.isLeft()) {
        return badRequest(addUserResult.value)
      }
      return created({ accessToken: addUserResult.value.accessToken })
    } catch (error: any) {
      console.error(error)
      return serverError(error)
    }
  }
}
