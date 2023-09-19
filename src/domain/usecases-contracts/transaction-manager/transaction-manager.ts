import type { Either } from '@/shared/either'
import type { GatewayIncompatibilityError, UserNotFoundError } from '../errors'

export type TransactionManagerData = {
  signature: string
  payload: any
}

export type TransactionEventData = {
  userId: string
  userName: string
  userEmail: string
  purchaseIntentId: string
}

export type TransactionManagerResponse = Either<GatewayIncompatibilityError | UserNotFoundError, null>

export interface TransactionManager {
  perform: (data: TransactionManagerData) => Promise<TransactionManagerResponse>
}
