import type { LoadCart } from '@/domain/usecases-contracts'
import type { Controller } from '@/presentation/contracts'
import { badRequest } from '@/presentation/helpers/http/http-helpers'
import type { HttpRequest, HttpResponse } from '@/presentation/http-types/http'

export class LoadCartController implements Controller {
  constructor (private readonly loadCart: LoadCart) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const loadCartResult = await this.loadCart.perform(httpRequest.headers.userId)
    if (loadCartResult.isLeft()) {
      return badRequest(loadCartResult.value)
    }
    return { statusCode: 0, body: '' }
  }
}
