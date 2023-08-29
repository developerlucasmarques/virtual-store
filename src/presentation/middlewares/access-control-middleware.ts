import type { Middleware } from '../contracts/middleware'
import { AccessTokenNotInformedError } from '../errors'
import { unauthorized } from '../helpers/http/http-helpers'
import type { HttpRequest, HttpResponse } from '../http-types/http'

export class AccessControlMiddleware implements Middleware {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const accessToken = httpRequest.headers?.['x-access-token']
    if (!accessToken) {
      return unauthorized(new AccessTokenNotInformedError())
    }
    return { statusCode: 0, body: '' }
  }
}
