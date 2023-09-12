import type { LoadCart } from '@/domain/usecases-contracts'
import type { Controller } from '@/presentation/contracts'
import { badRequest, ok, serverError } from '@/presentation/helpers/http/http-helpers'
import type { HttpRequest, HttpResponse } from '@/presentation/http-types/http'

export class LoadCartController implements Controller {
  constructor (private readonly loadCart: LoadCart) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const loadCartResult = await this.loadCart.perform(httpRequest.headers.userId)
      if (loadCartResult.isLeft()) {
        return badRequest(loadCartResult.value)
      }
      return ok(loadCartResult.value)
    } catch (error: any) {
      return serverError(error)
    }
  }
}
