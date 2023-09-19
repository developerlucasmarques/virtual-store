import type { TransactionManager } from '@/domain/usecases-contracts'
import type { Controller, Validation } from '@/presentation/contracts'
import { badRequest, noContent, serverError } from '@/presentation/helpers/http/http-helpers'
import type { HttpRequest, HttpResponse } from '@/presentation/http-types/http'

export class TransactionManagerController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly transactionManager: TransactionManager
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validations = [this.validation.validate(httpRequest.headers), this.validation.validate(httpRequest.body)]
      for (const validation of validations) {
        if (validation.isLeft()) {
          return badRequest(validation.value)
        }
      }
      const { headers: { signature }, body: { payload } } = httpRequest
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
