import type { ProductModel } from '@/domain/models'

export interface LoadProductByIdRepo {
  loadById: (id: string) => Promise<null | ProductModel>
}
