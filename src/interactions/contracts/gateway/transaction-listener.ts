import type { TransactionEventType } from '@/domain/usecases-contracts'
import type { GatewayIncompatibilityError } from '@/domain/usecases-contracts/errors'
import { type Either } from '@/shared/either'

export type TransactionListenerGatewayData = {
  signature: string
  payload: any
}

export type TransactionListenerGatewayValue = {
  userId: string
  purchaseIntentId: string
  eventType: TransactionEventType
}

export type TransactionListenerGatewayResponse = Either<GatewayIncompatibilityError | null, TransactionListenerGatewayValue>

export interface TransactionListenerGateway {
  listener: (data: TransactionListenerGatewayData) => Promise<TransactionListenerGatewayResponse>
}
