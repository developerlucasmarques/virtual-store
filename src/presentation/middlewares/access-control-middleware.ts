import type { AccessControl } from '@/domain/usecases-contracts'
import type { Middleware } from '../contracts/middleware'
import { AccessTokenNotInformedError } from '../errors'
import { unauthorized } from '../helpers/http/http-helpers'
import type { HttpRequest, HttpResponse } from '../http-types/http'
import type { RoleModel } from '@/domain/models'

export class AccessControlMiddleware implements Middleware {
  constructor (
    private readonly accessControl: AccessControl,
    private readonly role: RoleModel
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const accessToken = httpRequest.headers?.['x-access-token']
    if (!accessToken) {
      return unauthorized(new AccessTokenNotInformedError())
    }
    await this.accessControl.perform({ accessToken, role: this.role })
    return { statusCode: 0, body: '' }
  }
}
