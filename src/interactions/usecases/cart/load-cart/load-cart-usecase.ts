import type { LoadCart, LoadCartResponse } from '@/domain/usecases-contracts'
import { EmptyCartError } from '@/domain/usecases-contracts/errors'
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
    await this.loadProductsByIdsRepo.loadProductsByIds(productIds)
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
