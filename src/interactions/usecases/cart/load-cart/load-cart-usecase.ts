import type { CreateCart } from '@/domain/entities/contracts'
import type { LoadCart, LoadCartResponse } from '@/domain/usecases-contracts'
import { EmptyCartError } from '@/domain/usecases-contracts/errors'
import type { LoadCartByUserIdRepo, LoadProductsByIdsRepo } from '@/interactions/contracts'
import { left, right } from '@/shared/either'

export class LoadCartUseCase implements LoadCart {
  constructor (
    private readonly loadCartByUserIdRepo: LoadCartByUserIdRepo,
    private readonly loadProductsByIdsRepo: LoadProductsByIdsRepo,
    private readonly createCart: CreateCart
  ) {}

  async perform (userId: string): Promise<LoadCartResponse> {
    const cart = await this.loadCartByUserIdRepo.loadByUserId(userId)
    if (!cart || cart.products.length === 0) {
      return left(new EmptyCartError())
    }
    const cartProductIds = cart.products.map((product) => (product.id))
    const products = await this.loadProductsByIdsRepo.loadProductsByIds(cartProductIds)
    const ids = products.map((product) => product.id)
    for (const productId of cartProductIds) {
      if (!ids.includes(productId)) {
        const indexToRemove = cart.products.findIndex(product => product.id === productId)
        cart.products.splice(indexToRemove, 1)
      }
    }
    const completeCart = this.createCart.create({ cartModel: cart, products })
    return right(completeCart)
  }
}
