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
    const productIds = products.map(product => product.id)
    cart.products = cart.products.filter(product => productIds.includes(product.id))
    const completeCart = this.createCart.create({ cartModel: cart, products })
    return right(completeCart)
  }
}
