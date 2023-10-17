import type { EmailTemplate, FormatEmail, FormatEmailResponse } from '@/domain/application-contracts'
import type { ProductCartData } from '@/domain/models'

export type FormatEmailCheckoutCompletedProduct = Omit<ProductCartData, 'id'>

export type FormatEmailCheckoutCompletedData = {
  userName: string
  orderCode: string
  products: FormatEmailCheckoutCompletedProduct[]
}

export class FormatCheckoutCompletedEmailApplication implements FormatEmail<FormatEmailCheckoutCompletedData> {
  constructor (private readonly emailTemplate: EmailTemplate) {}

  execute (data: FormatEmailCheckoutCompletedData): FormatEmailResponse {
    let { html } = this.emailTemplate.handle()
    let products = ''
    data.products.forEach((product) => {
      products += `<li>${product.quantity} ${product.name} ${product.amount.toFixed(2)}</li>`
    })
    for (const key in data) {
      if (key !== 'products') {
        const keyString = key as keyof FormatEmailCheckoutCompletedData
        html = html.replace(`{{${keyString}}}`, String(data[keyString]))
      } else {
        html = html.replace(`{{${key}}}`, products)
      }
    }

    return { html }
  }
}
