import type { EmailTemplate, FormatEmail, FormatEmailResponse } from '@/domain/application-contracts'

export class FormatEmailApplication<T> implements FormatEmail<T> {
  constructor (private readonly emailTemplate: EmailTemplate) {}

  execute (data: T): FormatEmailResponse {
    const { html } = this.emailTemplate.handle()
    let template = html
    for (const key in data) {
      template = template.replace(`{{${key}}}`, String(data[key]))
    }
    return { html: template }
  }
}
