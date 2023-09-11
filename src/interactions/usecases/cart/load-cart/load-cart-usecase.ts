import type { LoadCart, LoadCartResponse } from '@/domain/usecases-contracts'
import { EmptyCartError } from '@/domain/usecases-contracts/errors'
import type { LoadCartByUserIdRepo } from '@/interactions/contracts'
import { left, right } from '@/shared/either'

export class LoadCartUseCase implements LoadCart {
  constructor (private readonly loadCartByUserIdRepo: LoadCartByUserIdRepo) {}

  async perform (userId: string): Promise<LoadCartResponse> {
    const cart = await this.loadCartByUserIdRepo.loadByUserId(userId)
    if (!cart) {
      return left(new EmptyCartError())
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
