import type { ProductModel } from '@/domain/models'
import type { LoadAllProducts } from '@/domain/usecases-contracts'
import type { LoadAllProductsRepo } from '@/interactions/contracts'

export class LoadAllProductsUseCase implements LoadAllProducts {
  constructor (private readonly loadAllProductsRepo: LoadAllProductsRepo) {}

  async perform (): Promise<ProductModel[]> {
    await this.loadAllProductsRepo.loadAll()
    return []
  }
}
