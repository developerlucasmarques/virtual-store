import type { LoadCart } from '@/domain/usecases-contracts'
import { EmptyCartError } from '@/domain/usecases-contracts/errors'
import type { Controller } from '@/presentation/contracts'
import { noContent, notFound, ok, serverError } from '@/presentation/helpers/http/http-helpers'
import type { HttpRequest, HttpResponse } from '@/presentation/http-types/http'

export class LoadCartController implements Controller {
  constructor (private readonly loadCart: LoadCart) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const loadCartResult = await this.loadCart.perform(httpRequest.headers.userId)
      if (loadCartResult.isLeft()) {
        if (loadCartResult.value instanceof EmptyCartError) {
          return noContent()
        }
        return notFound(loadCartResult.value)
      }
      return ok(loadCartResult.value)
    } catch (error: any) {
      return serverError(error)
    }
  }
}
