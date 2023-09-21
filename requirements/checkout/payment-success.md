# Payment Success

## Request Headers
* stripe-signature

## Request Body
* payload

## Caso de Sucesso

- ✅ Recebe uma requisição do tipo POST na rota /api/stripe/webhook
- ✅ Valida se a requisição foi feita pelo Stripe
- ✅ Busca as informações da intenção de compra pelo id que está no evento do Stripe
- ✅ Cria um pedido no DB
- ✅ Retorna 200 com success true


## Exceções

- ✅ Retorna erro 404 se o endpoint não existir
- ✅ Retorna erro 400 se o client não informar o stripe-signature ou se for inválido
- ✅ Retorna erro 500 se der erro ao tentar validar se a requisição foi feita pelo Stripe
- ✅ Retorna erro 500 se der erro ao tentar buscar as informações da intenção de compra
- ✅ Retorna erro 500 se der erro ao tentar criar um pedido no DB
