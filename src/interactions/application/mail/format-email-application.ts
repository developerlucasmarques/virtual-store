import type { EmailTemplate, FormatEmail } from '@/domain/application-contracts'

export class FormatEmailApplication<T> implements FormatEmail<T> {
  constructor (private readonly emailTemplate: EmailTemplate) {}

  async execute (data: T): Promise<string> {
    const { html } = this.emailTemplate.handle()
    let template = html
    for (const key in data) {
      template = template.replace(`{{${key}}}`, String(data[key]))
    }
    return template
  }
}
