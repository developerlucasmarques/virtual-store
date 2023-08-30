import type { LoadProductByIdResponse, LoadProductById } from '@/domain/usecases-contracts'
import { ProductNotFoundError } from '@/domain/usecases-contracts/export-errors'
import type { LoadProductByIdRepo } from '@/interactions/contracts'
import { left, right } from '@/shared/either'

export class LoadProductByIdUseCase implements LoadProductById {
  constructor (
    private readonly loadProductByIdRepo: LoadProductByIdRepo
  ) {}

  async perform (productId: string): Promise<LoadProductByIdResponse> {
    const product = await this.loadProductByIdRepo.loadById(productId)
    if (!product) {
      return left(new ProductNotFoundError(productId))
    }
    return right(product)
  }
}
