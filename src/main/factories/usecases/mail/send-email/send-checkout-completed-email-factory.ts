import type { EmailSender, SendCheckoutCompletedEmail } from '@/domain/usecases-contracts'
import { CheckoutCompletedFormatEmail } from '@/interactions/application/mail/format-email'
import { CheckoutCompletedEmailTemplate } from '@/interactions/application/mail/templates'
import { makeEmailSenderUseCase } from '../email-sender/email-sender-usecase-factory'

export const makeSendCheckoutCompletedEmail = (): EmailSender<SendCheckoutCompletedEmail> => {
  const requiredProps: Array<keyof SendCheckoutCompletedEmail> = [
    'orderCode', 'products', 'userName', 'userEmail'
  ]
  const subject = 'Pedido Confirmado'
  const template = new CheckoutCompletedEmailTemplate()
  const formatEmail = new CheckoutCompletedFormatEmail(template)
  return makeEmailSenderUseCase<SendCheckoutCompletedEmail>(
    requiredProps, subject, formatEmail
  )
}
