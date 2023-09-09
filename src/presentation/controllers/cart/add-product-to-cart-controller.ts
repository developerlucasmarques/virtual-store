import type { AddProductToCart } from '@/domain/usecases-contracts'
import type { Controller, Validation } from '@/presentation/contracts'
import { badRequest, serverError } from '@/presentation/helpers/http/http-helpers'
import type { HttpRequest, HttpResponse } from '@/presentation/http-types/http'

export class AddProductToCartController implements Controller {
  constructor (
    private readonly validationComposite: Validation,
    private readonly addProductToCart: AddProductToCart
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validations = this.validationComposite.validate(httpRequest.body)
      if (validations.isLeft()) {
        return badRequest(validations.value)
      }
      const { productId, productQty } = httpRequest.body
      await this.addProductToCart.perform({
        userId: httpRequest.headers.userId,
        productId,
        productQty
      })
      return { statusCode: 0, body: '' }
    } catch (error: any) {
      return serverError(error)
    }
  }
}
