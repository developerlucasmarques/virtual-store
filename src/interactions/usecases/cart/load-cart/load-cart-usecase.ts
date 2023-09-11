import type { LoadCart, LoadCartResponse } from '@/domain/usecases-contracts'
import { EmptyCartError, ProductNotAvailableError } from '@/domain/usecases-contracts/errors'
import type { LoadCartByUserIdRepo, LoadProductsByIdsRepo } from '@/interactions/contracts'
import { left, right } from '@/shared/either'

export class LoadCartUseCase implements LoadCart {
  constructor (
    private readonly loadCartByUserIdRepo: LoadCartByUserIdRepo,
    private readonly loadProductsByIdsRepo: LoadProductsByIdsRepo
  ) {}

  async perform (userId: string): Promise<LoadCartResponse> {
    const cart = await this.loadCartByUserIdRepo.loadByUserId(userId)
    if (!cart) {
      return left(new EmptyCartError())
    }
    const productIds = cart.products.map((product) => (product.id))
    const products = await this.loadProductsByIdsRepo.loadProductsByIds(productIds)
    if (products.length === 0) {
      return left(new ProductNotAvailableError(productIds[0]))
    }
    return right({
      id: '',
      userId: '',
      total: 0,
      products: [{
        id: '',
        name: '',
        amount: 0,
        quantity: 0
      }]
    })
  }
}
