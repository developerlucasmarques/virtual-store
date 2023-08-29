import type { ProductModel } from '@/domain/models'

export interface LoadAllProductsRepo {
  loadAll: () => Promise<ProductModel[]>
}
