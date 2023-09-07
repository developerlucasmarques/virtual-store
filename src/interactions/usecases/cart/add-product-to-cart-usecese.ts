import type { AddProductToCart, AddProductToCartData, AddProductToCartResponse } from '@/domain/usecases-contracts'
import type { LoadProductByIdRepo } from '@/interactions/contracts'
import { right } from '@/shared/either'

export class AddProductToCartUseCase implements AddProductToCart {
  constructor (private readonly loadProductByIdRepo: LoadProductByIdRepo) {}

  async perform (data: AddProductToCartData): Promise<AddProductToCartResponse> {
    await this.loadProductByIdRepo.loadById(data.productId)
    return right(null)
  }
}
