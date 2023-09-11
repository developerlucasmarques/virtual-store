import type { LoadCart, LoadCartResponse } from '@/domain/usecases-contracts'
import type { LoadCartByUserIdRepo } from '@/interactions/contracts'
import { right } from '@/shared/either'

export class LoadCartUseCase implements LoadCart {
  constructor (private readonly loadCartByUserIdRepo: LoadCartByUserIdRepo) {}

  async perform (userId: string): Promise<LoadCartResponse> {
    await this.loadCartByUserIdRepo.loadByUserId(userId)
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
