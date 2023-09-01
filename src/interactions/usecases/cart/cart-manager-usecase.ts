import type { CartManager, CartManagerData, CartManagerReponse } from '@/domain/usecases-contracts'
import { InvalidProductQuantityError } from '@/domain/usecases-contracts/errors'
import type { LoadCartByUserIdRepo } from '@/interactions/contracts'
import { left, right } from '@/shared/either'

export class CartManagerUseCase implements CartManager {
  constructor (private readonly loadCartByUserIdRepo: LoadCartByUserIdRepo) {}

  async perform (data: CartManagerData): Promise<CartManagerReponse> {
    if (data.productQty < 1) {
      return left(new InvalidProductQuantityError())
    }
    await this.loadCartByUserIdRepo.loadByUserId(data.userId)
    return right(null)
  }
}
