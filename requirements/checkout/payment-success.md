# Checkout

## Request Headers
* stripe-signature

## Request Body
* payload

## Caso de Sucesso

- ❌ Recebe uma requisição do tipo POST na rota /api/stripe/webhook
- ❌ Busca os dados 


## Exceções

- ✅ Retorna erro 404 se o endpoint não existir
- ✅ Retorna erro 404 se a algum produto do carrinho não estiver disponível
- ✅ Retorna erro 401 se o client não informar o token ou se for inválido
- ✅ Retorna erro 400 se não tiver nenhum produto no carrinho
- ✅ Retorna erro 500 se der erro ao tentar decriptar token do usuário
- ✅ Retorna erro 500 se der erro ao tentar buscar o carrinho do usuário
- ✅ Retorna erro 500 se der erro ao tentar conectar com a Api Stripe



