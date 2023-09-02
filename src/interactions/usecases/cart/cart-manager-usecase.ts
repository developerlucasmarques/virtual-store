import type { CartManager, AddProductToCartData, CartManagerReponse, CreateCart, AddProductToCart } from '@/domain/usecases-contracts'
import { InvalidProductQuantityError } from '@/domain/usecases-contracts/errors'
import type { LoadCartByUserIdRepo } from '@/interactions/contracts'
import { left, right } from '@/shared/either'

export class CartManagerUseCase implements CartManager {
  constructor (
    private readonly loadCartByUserIdRepo: LoadCartByUserIdRepo,
    private readonly createCart: CreateCart,
    private readonly addProductToCart: AddProductToCart
  ) {}

  async perform (data: AddProductToCartData): Promise<CartManagerReponse> {
    if (data.productQty < 1) {
      return left(new InvalidProductQuantityError())
    }
    const cart = await this.loadCartByUserIdRepo.loadByUserId(data.userId)
    if (!cart) {
      await this.createCart.perform(data)
    }
    await this.addProductToCart.perform(data)
    return right(null)
  }
}
