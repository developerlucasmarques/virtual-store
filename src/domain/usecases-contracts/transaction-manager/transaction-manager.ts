import type { Either } from '@/shared/either'
import type { EventNotProcessError, GatewayExceptionError, GatewayIncompatibilityError, OrderNotFoundError, UserMismatchError, UserNotFoundError } from '../errors'

export type TransactionManagerData = {
  signature: string
  payload: any
}

export type TransactionEventType = 'CheckoutCompleted' | 'PaymentSuccess' | 'PaymentFailure'

export type ProductOfTransactionEvent = {
  id: string
  name: string
  amount: number
  quantity: number
}

export type TransactionEventData = {
  userId: string
  userName: string
  userEmail: string
  orderCode: string
  orderId: string
  products: ProductOfTransactionEvent[]
}

export type TransactionManagerResponse = Either<
GatewayIncompatibilityError |
GatewayExceptionError |
EventNotProcessError |
UserNotFoundError |
OrderNotFoundError |
UserMismatchError,
null
>

export interface TransactionManager {
  perform: (data: TransactionManagerData) => Promise<TransactionManagerResponse>
}
