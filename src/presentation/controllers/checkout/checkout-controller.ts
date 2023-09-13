import type { Checkout } from '@/domain/usecases-contracts'
import type { Controller } from '@/presentation/contracts'
import type { HttpRequest, HttpResponse } from '@/presentation/http-types/http'

export class CheckoutController implements Controller {
  constructor (private readonly checkout: Checkout) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    await this.checkout.perform(httpRequest.headers.userId)
    return { statusCode: 0, body: '' }
  }
}
