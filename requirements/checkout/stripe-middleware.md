# Checkout

## Request Headers
* stripe-signature

## Request Body
* payload

## Caso de Sucesso

- ❌ Intercepta a requisição
- ❌ Valida se a requisição foi feita pelo Stripe
- ❌ Repassa a requisição para o controller


## Exceções

- ❌ Retorna erro 400 se o client não informar o campo stripe-signature
- ❌ Retorna erro 400 o client não informar o body
- ❌ Retorna erro 400 se a requisição não foi feita pelo Stripe
- ❌ Retorna erro 500 se der erro ao tentar validar se a requisição foi feita pelo Stripe



