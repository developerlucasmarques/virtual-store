import type { TransactionEventType } from '@/domain/usecases-contracts'

export type TransactionListenerGatewayData = {
  signature: string
  payload: any
}

export type TransactionListenerGatewayResponse = {
  userId: string
  purchaseIntentId: string
  eventType: TransactionEventType
}

export interface TransactionListenerGateway {
  listener: (data: TransactionListenerGatewayData) => Promise<null | TransactionListenerGatewayResponse>
}
