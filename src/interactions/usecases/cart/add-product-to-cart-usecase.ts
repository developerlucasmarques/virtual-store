import type { AddProductToCart, AddProductToCartData, AddProductToCartReponse } from '@/domain/usecases-contracts'
import { InvalidProductQuantityError } from '@/domain/usecases-contracts/errors'
import type { LoadCartByUserIdRepo } from '@/interactions/contracts'
import { left, right } from '@/shared/either'

export class AddProductToCartUseCase implements AddProductToCart {
  constructor (private readonly loadCartByUserIdRepo: LoadCartByUserIdRepo) {}

  async perform (data: AddProductToCartData): Promise<AddProductToCartReponse> {
    if (data.productQty < 1) {
      return left(new InvalidProductQuantityError())
    }
    await this.loadCartByUserIdRepo.loadByUserId(data.userId)
    return right(null)
  }
}
