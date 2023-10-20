import type { FormatEmail } from '@/domain/application-contracts'
import type { EmailSender, RequiredFieldEmailSender } from '@/domain/usecases-contracts'
import { NodemailerAdapter } from '@/external/mail/nodemailer/nodemailer-adapter'
import { EmailSenderUseCase } from '@/interactions/usecases/mail/email-sender-usecase'

export const makeEmailSenderUseCase = <T extends RequiredFieldEmailSender>(
  requiredProps: Array<keyof T>, subject: string, formatEmail: FormatEmail<T>
): EmailSender<T> => {
  const nodeMailerAdapter = new NodemailerAdapter()
  return new EmailSenderUseCase<T>(
    requiredProps, subject, formatEmail, nodeMailerAdapter
  )
}
