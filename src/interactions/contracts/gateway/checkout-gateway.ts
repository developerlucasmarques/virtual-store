import type { CompleteCartModel } from '@/domain/models'

export type CheckoutGatewayResponse = {
  url: string
  gatewayCustomerId: string
}

export type CheckoutGatewayData = CompleteCartModel & {
  userEmail: string
  userId: string
}

export interface CheckoutGateway {
  payment: (data: CheckoutGatewayData) => Promise<null | CheckoutGatewayResponse>
}
