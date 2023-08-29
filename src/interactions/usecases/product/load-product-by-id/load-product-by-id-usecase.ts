import type { LoadProductByIdResponse, LoadProductById } from '@/domain/usecases-contracts'
import type { LoadProductByIdRepo } from '@/interactions/contracts'
import { right } from '@/shared/either'

export class LoadProductByIdUseCase implements LoadProductById {
  constructor (private readonly loadProductByIdRepo: LoadProductByIdRepo) {}

  async perform (productId: string): Promise<LoadProductByIdResponse> {
    await this.loadProductByIdRepo.loadById(productId)
    return right({ id: '', amount: 0, description: '', name: '' })
  }
}
