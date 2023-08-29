import type { LoadAllProducts } from '@/domain/usecases-contracts'
import type { Controller } from '@/presentation/contracts'
import type { HttpRequest, HttpResponse } from '@/presentation/http-types/http'

export class LoadAllProductsController implements Controller {
  constructor (private readonly loadAllProducts: LoadAllProducts) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    await this.loadAllProducts.perform()
    return { statusCode: 0, body: '' }
  }
}
