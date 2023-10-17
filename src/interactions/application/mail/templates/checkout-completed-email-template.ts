import type { EmailTemplate, EmailTemplateResponse } from '@/domain/application-contracts'

export class CheckoutCompletedEmailTemplate implements EmailTemplate {
  private readonly template: string

  constructor () { this.template = this.createTemplate() }

  handle (): EmailTemplateResponse {
    return { html: this.template }
  }

  private createTemplate (): string {
    return `
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
            <p>Olá, {{userName}},</p>
            <p>O seu pedido com o código {{orderCode}} foi realizado com sucesso. Aqui estão seus produtos:</p>
            <ul>
                {{products}}
            </ul>
            <p>Agradecemos por escolher nossos produtos. Seu pedido será processado em breve.</p>
        </div>
        <div class="footer">
            <p>Copyright &copy; 2023 Virtual Store</p>
        </div>
    </div>
</body>
</html>`
  }
}
