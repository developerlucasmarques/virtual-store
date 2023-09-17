import type { Either } from '@/shared/either'
import type { PurchaseIntentNotFoundError } from '../errors'

export type AddOrderData = {
  purchaseIntentId: string
}

export type AddOrderResponse = Either<PurchaseIntentNotFoundError, null>

export interface AddOrder {
  perform: (data: AddOrderData) => Promise<AddOrderResponse>
}
