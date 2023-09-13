import type { Checkout } from '@/domain/usecases-contracts'
import { EmptyCartError } from '@/domain/usecases-contracts/errors'
import type { Controller } from '@/presentation/contracts'
import { badRequest, notFound } from '@/presentation/helpers/http/http-helpers'
import type { HttpRequest, HttpResponse } from '@/presentation/http-types/http'

export class CheckoutController implements Controller {
  constructor (private readonly checkout: Checkout) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const checkoutResult = await this.checkout.perform(httpRequest.headers.userId)
    if (checkoutResult.isLeft()) {
      if (checkoutResult.value instanceof EmptyCartError) {
        return badRequest(checkoutResult.value)
      }
      return notFound(checkoutResult.value)
    }
    return { statusCode: 0, body: '' }
  }
}
