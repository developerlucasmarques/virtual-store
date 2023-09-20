import type { Middleware, Validation } from '../contracts'
import { badRequest, noContent, serverError } from '../helpers/http/http-helpers'
import type { HttpRequest, HttpResponse } from '../http-types/http'

export class HeadersValidationMiddleware implements Middleware {
  constructor (private readonly validation: Validation) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validation = this.validation.validate(httpRequest.headers)
      if (validation.isLeft()) {
        return badRequest(validation.value)
      }
      return noContent()
    } catch (error: any) {
      return serverError(error)
    }
  }
}
