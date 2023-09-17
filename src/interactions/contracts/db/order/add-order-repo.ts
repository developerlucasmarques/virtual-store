import type { OrderModel } from '@/domain/models'

export interface AddOrderRepo {
  add: (data: OrderModel) => Promise<void>
}
