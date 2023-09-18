export type TransactionListenerGatewayData = {
  signature: string
  payload: any
}

export type TransactionListenerGatewayResponse = {
  userId: string
  purchaseIntentId: string
}

export interface TransactionListenerGateway {
  listener: (data: TransactionListenerGatewayData) => Promise<TransactionListenerGatewayResponse>
}
