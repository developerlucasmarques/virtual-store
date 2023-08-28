import type { ProductModel } from '@/domain/models'

export interface AddProductRepo {
  add: (data: ProductModel) => Promise<void>
}
