import type { AccessControl } from '@/domain/usecases-contracts'
import type { Middleware } from '../contracts/middleware'
import { AccessTokenNotInformedError } from '../errors'
import { forbidden, serverError, unauthorized } from '../helpers/http/http-helpers'
import type { HttpRequest, HttpResponse } from '../http-types/http'
import type { RoleModel } from '@/domain/models'
import { InvalidTokenError } from '@/domain/usecases-contracts/export-errors'

export class AccessControlMiddleware implements Middleware {
  constructor (
    private readonly accessControl: AccessControl,
    private readonly role: RoleModel
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accessToken = httpRequest.headers?.['x-access-token']
      if (!accessToken) {
        return unauthorized(new AccessTokenNotInformedError())
      }
      const accessControleResult = await this.accessControl.perform({
        accessToken, role: this.role
      })
      if (accessControleResult.isLeft()) {
        if (accessControleResult.value instanceof InvalidTokenError) {
          return unauthorized(accessControleResult.value)
        }
        return forbidden(accessControleResult.value)
      }
      return { statusCode: 0, body: '' }
    } catch (error: any) {
      return serverError(error)
    }
  }
}
