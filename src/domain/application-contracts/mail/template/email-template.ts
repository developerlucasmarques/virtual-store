export type EmailTemplateResponse = {
  html: string
}

export interface EmailTemplate {
  handle: () => EmailTemplateResponse
}
