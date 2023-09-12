import type { LoadCart } from '@/domain/usecases-contracts'
import type { Controller } from '@/presentation/contracts'
import type { HttpRequest, HttpResponse } from '@/presentation/http-types/http'

export class LoadCartController implements Controller {
  constructor (private readonly loadCart: LoadCart) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    await this.loadCart.perform(httpRequest.headers.userId)
    return { statusCode: 0, body: '' }
  }
}
