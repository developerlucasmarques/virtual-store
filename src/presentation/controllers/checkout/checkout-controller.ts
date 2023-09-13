import type { Checkout } from '@/domain/usecases-contracts'
import type { Controller } from '@/presentation/contracts'
import { notFound } from '@/presentation/helpers/http/http-helpers'
import type { HttpRequest, HttpResponse } from '@/presentation/http-types/http'

export class CheckoutController implements Controller {
  constructor (private readonly checkout: Checkout) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const checkoutResult = await this.checkout.perform(httpRequest.headers.userId)
    if (checkoutResult.isLeft()) {
      return notFound(checkoutResult.value)
    }
    return { statusCode: 0, body: '' }
  }
}
