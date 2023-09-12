import type { CompleteCartModel } from '@/domain/models'
import type { CheckoutResponseValue } from '@/domain/usecases-contracts'

export type CheckoutGatewayResponse = {
  value: string
}

export interface CheckoutGateway {
  payment: (data: CompleteCartModel) => Promise<CheckoutResponseValue>
}
