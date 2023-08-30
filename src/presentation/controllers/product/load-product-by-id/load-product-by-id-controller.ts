import type { Controller, Validation } from '@/presentation/contracts'
import type { HttpRequest, HttpResponse } from '@/presentation/http-types/http'

export class LoadProductByIdController implements Controller {
  constructor (private readonly validationComposite: Validation) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    this.validationComposite.validate(httpRequest.params?.productId)
    return { statusCode: 0, body: '' }
  }
}
