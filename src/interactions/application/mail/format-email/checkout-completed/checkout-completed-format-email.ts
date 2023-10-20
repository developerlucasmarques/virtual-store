import type { EmailTemplate, FormatEmailResponse, OrderFormatEmail, OrderFormatEmailData } from '@/domain/application-contracts'

export class CheckoutCompletedFormatEmail implements OrderFormatEmail {
  constructor (private readonly emailTemplate: EmailTemplate) {}

  execute (data: OrderFormatEmailData): FormatEmailResponse {
    let { html } = this.emailTemplate.handle()
    let products = ''
    data.products.forEach((product) => {
      products += `<li>${product.quantity} ${product.name} ${product.amount.toFixed(2)}</li>`
    })
    for (const key in data) {
      if (key !== 'products') {
        const keyString = key as keyof OrderFormatEmailData
        html = html.replace(`{{${keyString}}}`, String(data[keyString]))
      } else {
        html = html.replace(`{{${key}}}`, products)
      }
    }
    return { html }
  }
}
