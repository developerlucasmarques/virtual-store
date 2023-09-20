import type { Middleware, Validation } from '../contracts'
import type { HttpRequest, HttpResponse } from '../http-types/http'

export class HeadersValidationMiddleware implements Middleware {
  constructor (private readonly validation: Validation) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    this.validation.validate(httpRequest.headers)
    return { statusCode: 0, body: '' }
  }
}
