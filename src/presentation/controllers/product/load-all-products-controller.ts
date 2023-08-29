import type { LoadAllProducts } from '@/domain/usecases-contracts'
import type { Controller } from '@/presentation/contracts'
import { noContent, serverError } from '@/presentation/helpers/http/http-helpers'
import type { HttpRequest, HttpResponse } from '@/presentation/http-types/http'

export class LoadAllProductsController implements Controller {
  constructor (private readonly loadAllProducts: LoadAllProducts) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const products = await this.loadAllProducts.perform()
      if (products.length === 0) return noContent()
      return { statusCode: 0, body: '' }
    } catch (error: any) {
      console.error(error)
      return serverError(error)
    }
  }
}
