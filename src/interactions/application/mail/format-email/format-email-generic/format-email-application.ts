import type { EmailTemplate, FormatEmail, FormatEmailResponse } from '@/domain/application-contracts'

export class FormatEmailApplication<T> implements FormatEmail<T> {
  constructor (private readonly emailTemplate: EmailTemplate) {}

  execute (data: T): FormatEmailResponse {
    let { html } = this.emailTemplate.handle()
    for (const key in data) {
      html = html.replace(`{{${key}}}`, String(data[key]))
    }
    return { html }
  }
}
