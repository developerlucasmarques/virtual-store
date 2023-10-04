export type EmailSenderProviderData = {
  recipientName: string
  recipientEmail: string
  subject: string
  html: string
}

export interface EmailSenderProvider {
  sendEmail: (data: EmailSenderProviderData) => Promise<void>
}
