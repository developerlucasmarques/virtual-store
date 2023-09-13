import type { Checkout } from '@/domain/usecases-contracts'
import { CheckoutFailureError, EmptyCartError } from '@/domain/usecases-contracts/errors'
import type { Controller } from '@/presentation/contracts'
import { badRequest, notFound, ok, serverError } from '@/presentation/helpers/http/http-helpers'
import type { HttpRequest, HttpResponse } from '@/presentation/http-types/http'

export class CheckoutController implements Controller {
  constructor (private readonly checkout: Checkout) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const checkoutResult = await this.checkout.perform(httpRequest.headers.userId)
      if (checkoutResult.isLeft()) {
        if (checkoutResult.value instanceof EmptyCartError) {
          return badRequest(checkoutResult.value)
        }
        if (checkoutResult.value instanceof CheckoutFailureError) {
          return serverError(checkoutResult.value)
        }
        return notFound(checkoutResult.value)
      }
      return ok(checkoutResult.value)
    } catch (error: any) {
      return serverError(error)
    }
  }
}
