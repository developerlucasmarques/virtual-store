import type { OrderModel } from '@/domain/models'

export interface LoadOrderByIdRepo {
  loadById: (id: string) => Promise<null | OrderModel>
}
