import type { AddUser } from '@/domain/usecases'
import type { Validation, Controller } from '../contracts'
import { badRequest } from '../helpers/http/http-helpers'
import type { HttpRequest, HttpResponse } from '../http-types/http'

export class SignUpController implements Controller {
  constructor (
    private readonly validationComposite: Validation,
    private readonly addUser: AddUser
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const validation = this.validationComposite.validate(httpRequest.body)
    if (validation.isLeft()) {
      return badRequest(validation.value)
    }
    const { name, email, password } = httpRequest.body
    await this.addUser.perform({ name, email, password })
    return await Promise.resolve({
      body: '',
      statusCode: 0
    })
  }
}
