import type { OrderFormatEmailData } from '@/domain/application-contracts'

export type SendCheckoutCompletedEmail = OrderFormatEmailData & {
  userEmail: string
}
