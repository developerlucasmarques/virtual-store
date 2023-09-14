import type { CompleteCartModel } from '@/domain/models'
import type { CheckoutResponseValue } from '@/domain/usecases-contracts'

export type CheckoutGatewayResponse = CheckoutResponseValue

export type CheckoutGatewayData = CompleteCartModel & { email: string }

export interface CheckoutGateway {
  payment: (data: CheckoutGatewayData) => Promise<null | CheckoutResponseValue>
}
