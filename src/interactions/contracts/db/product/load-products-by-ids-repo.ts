import type { ProductModel } from '@/domain/models'

export interface LoadProductsByIdsRepo {
  loadProductsByIds: (productIds: string[]) => Promise<ProductModel[]>
}
