import type { AddProduct } from '@/domain/usecases-contracts'
import type { Controller, Validation } from '@/presentation/contracts'
import { badRequest, noContent, serverError } from '@/presentation/helpers/http/http-helpers'
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
      const addProductResult = await this.addProduct.perform(httpRequest.body)
      if (addProductResult.isLeft()) {
        return badRequest(addProductResult.value)
      }
      return noContent()
    } catch (error: any) {
      return serverError(error)
    }
  }
}
