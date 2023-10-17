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
    this.emailTemplate.handle()
    let productsString = ''
    data.products.forEach((product) => {
      productsString += `<li>${product.quantity} ${product.name} ${product.amount.toFixed(2)}</li><br/>`
    })
    const html = `
    <!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Seu Pedido: {{orderCode}}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
        }
        .header {
            text-align: center;
            background-color: #007BFF;
            color: #fff;
            padding: 10px;
            border-top-left-radius: 5px;
            border-top-right-radius: 5px;
        }
        .content {
            padding: 20px;
        }
        .footer {
            text-align: center;
            padding: 10px;
            background-color: #007BFF;
            color: #fff;
            border-bottom-left-radius: 5px;
            border-bottom-right-radius: 5px;
        }

        @media (max-width: 600px) {
            .container {
                max-width: 100%;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Confirmação de Pedido</h1>
        </div>
        <div class="content">
            <p>Olá, ${data.userName},</p>
            <p>O seu pedido com o código ${data.orderCode} foi realizado com sucesso. Aqui estão seus produtos:</p>
            <ul>
                ${productsString}
            </ul>
            <p>Agradecemos por escolher nossos produtos. Seu pedido será processado em breve.</p>
        </div>
        <div class="footer">
            <p>Copyright &copy; 2023 Virtual Store</p>
        </div>
    </div>
</body>
</html>
`
    return { html }
  }
}
