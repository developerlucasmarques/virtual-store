import type { AddProductToCart, AddProductToCartData, AddProductToCartResponse } from '@/domain/usecases-contracts'
import { ProductNotFoundError } from '@/domain/usecases-contracts/errors'
import type { LoadProductByIdRepo } from '@/interactions/contracts'
import { left, right } from '@/shared/either'

export class AddProductToCartUseCase implements AddProductToCart {
  constructor (private readonly loadProductByIdRepo: LoadProductByIdRepo) {}

  async perform (data: AddProductToCartData): Promise<AddProductToCartResponse> {
    const product = await this.loadProductByIdRepo.loadById(data.productId)
    if (!product) {
      return left(new ProductNotFoundError(data.productId))
    }
    return right(null)
  }
}
