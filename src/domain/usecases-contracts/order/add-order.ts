import type { Either } from '@/shared/either'
import type { PurchaseIntentNotFoundError } from '../errors'
import type { Event } from '../event-manager/event'

export type AddOrderData = {
  purchaseIntentId: string
  userId: string
}

export type AddOrderResponse = Either<PurchaseIntentNotFoundError, null>

export interface AddOrder extends Event<AddOrderData> {
  perform: (data: AddOrderData) => Promise<AddOrderResponse>
}
