import type { AddProduct } from '@/domain/usecases-contracts'
import type { Controller, Validation } from '@/presentation/contracts'
import { badRequest, serverError } from '@/presentation/helpers/http/http-helpers'
import type { HttpRequest, HttpResponse } from '@/presentation/http-types/http'

export class AddProductController implements Controller {
  constructor (
    private readonly validationComposite: Validation,
    private readonly addProduct: AddProduct
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validations = this.validationComposite.validate(httpRequest.body)
      if (validations.isLeft()) {
        return badRequest(validations.value)
      }
      await this.addProduct.perform(httpRequest.body)
      return { statusCode: 0, body: '' }
    } catch (error: any) {
      return serverError(error)
    }
  }
}
