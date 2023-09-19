import type { TransactionManager } from '@/domain/usecases-contracts'
import type { Controller, Validation } from '@/presentation/contracts'
import { PayloadNotInformedError, SignatureNotInformedError } from '@/presentation/errors'
import { badRequest, noContent, serverError } from '@/presentation/helpers/http/http-helpers'
import type { HttpRequest, HttpResponse } from '@/presentation/http-types/http'

export class TransactionManagerController implements Controller {
  constructor (
    private readonly validationComposite: Validation,
    private readonly transactionManager: TransactionManager
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      this.validationComposite.validate(httpRequest)
      const signature = httpRequest.headers?.signature
      if (!signature) {
        return badRequest(new SignatureNotInformedError())
      }
      const payload = httpRequest.body?.payload
      if (!payload) {
        return badRequest(new PayloadNotInformedError())
      }
      const transactionResult = await this.transactionManager.perform({ signature, payload })
      if (transactionResult.isLeft()) {
        return serverError(transactionResult.value)
      }
      return noContent()
    } catch (error: any) {
      return serverError(error)
    }
  }
}
