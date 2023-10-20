import { EmailSenderUseCase } from '@/interactions/usecases/mail/email-sender-usecase'
import { makeSendCheckoutCompletedEmail } from './send-checkout-completed-email-factory'
import type { SendCheckoutCompletedEmail } from '@/domain/usecases-contracts'
import { CheckoutCompletedEmailTemplate } from '@/interactions/application/mail/templates'
import { CheckoutCompletedFormatEmail } from '@/interactions/application/mail/format-email'
import { NodemailerAdapter } from '@/external/mail/nodemailer/nodemailer-adapter'

jest.mock('@/interactions/usecases/mail/email-sender-usecase')

describe('SendCheckoutCompletedEmail Factory', () => {
  it('Should call EmailSenderUseCase with correct values', async () => {
    makeSendCheckoutCompletedEmail()
    const requiredProps: Array<keyof SendCheckoutCompletedEmail> = [
      'orderCode', 'products', 'userName', 'userEmail'
    ]
    const subject = 'Pedido Confirmado'
    const template = new CheckoutCompletedEmailTemplate()
    const formatEmail = new CheckoutCompletedFormatEmail(template)
    const nodeMailerAdapter = new NodemailerAdapter()
    expect(EmailSenderUseCase).toHaveBeenCalledWith(
      requiredProps, subject, formatEmail, nodeMailerAdapter
    )
  })
})
