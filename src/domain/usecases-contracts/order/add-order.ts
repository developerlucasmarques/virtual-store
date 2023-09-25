import type { ProductOfOrderModel } from '@/domain/models'
import type { Either } from '@/shared/either'
import type { Event } from '../event-manager/event'

export type AddOrderData = {
  userId: string
  products: ProductOfOrderModel[]
}

export interface AddOrder extends Event<AddOrderData> {
  perform: (data: AddOrderData) => Promise<Either<Error, null>>
}
