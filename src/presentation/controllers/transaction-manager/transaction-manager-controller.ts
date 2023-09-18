import type { Controller } from '@/presentation/contracts'
import { SignatureNotInformedError } from '@/presentation/errors'
import { badRequest } from '@/presentation/helpers/http/http-helpers'
import type { HttpRequest, HttpResponse } from '@/presentation/http-types/http'

export class TransactionManagerController implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const signature = httpRequest.headers?.signature
    if (!signature) {
      return badRequest(new SignatureNotInformedError())
    }
    return { statusCode: 0, body: '' }
  }
}
