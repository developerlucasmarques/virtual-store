import type { TransactionManager } from '@/domain/usecases-contracts'
import { EventNotProcessError } from '@/domain/usecases-contracts/errors'
import type { Controller } from '@/presentation/contracts'
import { noContent, ok, serverError } from '@/presentation/helpers/http/http-helpers'
import type { HttpRequest, HttpResponse } from '@/presentation/http-types/http'

export class TransactionManagerController implements Controller {
  constructor (private readonly transactionManager: TransactionManager) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { headers: { signature }, body: payload } = httpRequest
      const transactionResult = await this.transactionManager.perform({ signature, payload })
      if (transactionResult.isLeft()) {
        if (transactionResult.value instanceof EventNotProcessError) {
          return noContent()
        }
        return serverError(transactionResult.value)
      }
      return ok({ success: true })
    } catch (error: any) {
      return serverError(error)
    }
  }
}
