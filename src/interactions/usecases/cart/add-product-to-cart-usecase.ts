import type { AddProductToCart, AddProductToCartData, AddProductToCartReponse } from '@/domain/usecases-contracts'
import { InvalidProductQuantityError } from '@/domain/usecases-contracts/errors'
import { left, right } from '@/shared/either'

export class AddProductToCartUseCase implements AddProductToCart {
  async perform (data: AddProductToCartData): Promise<AddProductToCartReponse> {
    if (data.productQty < 1) {
      return left(new InvalidProductQuantityError())
    }
    return right(null)
  }
}
