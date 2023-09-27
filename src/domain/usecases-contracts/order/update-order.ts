import type { Either } from '@/shared/either'
import type { MissingStatusError, OrderNotFoundError } from '../errors'
import type { Event } from '../event-manager/event'

export type UpdateOrderData = {
  orderId: string
}

export type UpdateOrderResponse = Either<MissingStatusError | OrderNotFoundError, null>

export interface UpdateOrder extends Event<UpdateOrderData> {
  perform: (data: UpdateOrderData) => Promise<UpdateOrderResponse>
}
