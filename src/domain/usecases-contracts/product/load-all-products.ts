import type { ProductModel } from '@/domain/models'

export interface LoadAllProducts {
  perform: () => Promise<ProductModel[]>
}
