import type { FormatEmail } from '@/domain/application-contracts'
import type { EmailSender, RequiredFieldEmailSender } from '@/domain/usecases-contracts'
import type { EmailSenderProvider } from '@/interactions/contracts'

export class EmailSenderUseCase<T extends RequiredFieldEmailSender> implements EmailSender<T> {
  constructor (
    public readonly requiredProps: Array<keyof T>,
    private readonly subject: string,
    private readonly formatEmail: FormatEmail<T>,
    private readonly emailSenderProvider: EmailSenderProvider
  ) {}

  async perform (data: T): Promise<void> {
    const { html } = this.formatEmail.execute(data)
    const { userEmail: recipientEmail } = data
    await this.emailSenderProvider.sendEmail({
      html, recipientEmail, subject: this.subject
    })
  }
}
