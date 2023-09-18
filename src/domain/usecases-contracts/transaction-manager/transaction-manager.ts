import type { Either } from '@/shared/either'
import type { GatewayIncompatibilityError } from '../errors'

export type TransactionManagerData = {
  signature: string
  payload: any
}

export type TransactionManagerResponse = Either<GatewayIncompatibilityError, null>

export interface TransactionManager {
  perform: (data: TransactionManagerData) => Promise<TransactionManagerResponse>
}
