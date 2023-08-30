import type { Controller, Validation } from '@/presentation/contracts'
import { badRequest } from '@/presentation/helpers/http/http-helpers'
import type { HttpRequest, HttpResponse } from '@/presentation/http-types/http'

export class LoadProductByIdController implements Controller {
  constructor (private readonly validation: Validation) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const validation = this.validation.validate(httpRequest.params?.productId)
    if (validation.isLeft()) {
      return badRequest(validation.value)
    }
    return { statusCode: 0, body: '' }
  }
}
