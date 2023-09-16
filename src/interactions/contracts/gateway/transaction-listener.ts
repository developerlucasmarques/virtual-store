export type TransactionListenerGatewayData = {
  signature: string
  payload: any
}

export type TransactionListenerGatewayResponse = {
  userId: string
  customerId: string
}

export interface TransactionListenerGateway {
  listener: (data: TransactionListenerGatewayData) => Promise<TransactionListenerGatewayResponse>
}
