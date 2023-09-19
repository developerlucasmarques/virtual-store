import type { EventType } from '@/domain/usecases-contracts'

export type TransactionListenerGatewayData = {
  signature: string
  payload: any
}

export type TransactionListenerGatewayResponse = {
  userId: string
  purchaseIntentId: string
  eventName: EventType
}

export interface TransactionListenerGateway {
  listener: (data: TransactionListenerGatewayData) => Promise<null | TransactionListenerGatewayResponse>
}
