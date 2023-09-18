import type { TransactionManager } from '@/domain/usecases-contracts'
import type { Controller } from '@/presentation/contracts'
import { PayloadNotInformedError, SignatureNotInformedError } from '@/presentation/errors'
import { badRequest } from '@/presentation/helpers/http/http-helpers'
import type { HttpRequest, HttpResponse } from '@/presentation/http-types/http'

export class TransactionManagerController implements Controller {
  constructor (private readonly transactionManager: TransactionManager) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const signature = httpRequest.headers?.signature
    if (!signature) {
      return badRequest(new SignatureNotInformedError())
    }
    const payload = httpRequest.body?.payload
    if (!payload) {
      return badRequest(new PayloadNotInformedError())
    }
    await this.transactionManager.perform({ signature, payload })
    return { statusCode: 0, body: '' }
  }
}
