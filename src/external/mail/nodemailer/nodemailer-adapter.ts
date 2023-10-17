import type { EmailSenderProvider, EmailSenderProviderData } from '@/interactions/contracts'
import { NodemailerHelper } from './helpers/nodemailer-helper'

export class NodemailerAdapter implements EmailSenderProvider {
  async sendEmail (data: EmailSenderProviderData): Promise<void> {
    const transport = NodemailerHelper.createTransport()
    await transport.sendMail({
      from: 'Virtual Store',
      to: data.recipientEmail,
      subject: data.subject,
      html: data.html
    })
  }
}
