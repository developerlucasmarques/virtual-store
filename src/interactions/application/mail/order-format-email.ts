import type { EmailTemplate, FormatEmail } from '@/domain/application-contracts'

export class OrderFormatEmail<T> implements FormatEmail<T> {
  constructor (private readonly emailTemplate: EmailTemplate) {}

  async execute (data: T): Promise<string> {
    this.emailTemplate.handle()
    return ''
  }
}
