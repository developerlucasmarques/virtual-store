import type { Controller, Validation } from '@/presentation/contracts'
import { badRequest } from '@/presentation/helpers/http/http-helpers'
import type { HttpRequest, HttpResponse } from '@/presentation/http-types/http'

export class AddProductToCartController implements Controller {
  constructor (private readonly validationComposite: Validation) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const validations = this.validationComposite.validate(httpRequest.body)
    if (validations.isLeft()) {
      return badRequest(validations.value)
    }
    return { statusCode: 0, body: '' }
  }
}
