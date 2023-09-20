import type { Middleware, Validation } from '../contracts'
import { badRequest } from '../helpers/http/http-helpers'
import type { HttpRequest, HttpResponse } from '../http-types/http'

export class HeadersValidationMiddleware implements Middleware {
  constructor (private readonly validation: Validation) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const validation = this.validation.validate(httpRequest.headers)
    if (validation.isLeft()) {
      return badRequest(validation.value)
    }
    return { statusCode: 0, body: '' }
  }
}
