import type { TransactionManager } from '@/domain/usecases-contracts'
import { EventNotProcessError } from '@/domain/usecases-contracts/errors'
import type { Controller } from '@/presentation/contracts'
import { noContent, serverError } from '@/presentation/helpers/http/http-helpers'
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
      return noContent()
    } catch (error: any) {
      return serverError(error)
    }
  }
}
