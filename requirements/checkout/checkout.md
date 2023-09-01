# Checkout

## Request Body
* cpf
* phone

## Request Headers
* x-access-token

## Caso de Sucesso

- ❌ Recebe uma requisição do tipo POST na rota /api/checkout
- ❌ Valida se a requisição foi feita por um usuário
- ❌ Valida os dados obrigatórios
- ❌ Valida o tipo do dado informado
- ❌ Valida se não há dados a mais dos requeridos
- ❌ Gera um ID para a compra
- ❌ Salva os dados dos produtos que usuário está comprando no db junto com o DateTime
- ❌ Envia os dados para o checkout da Api Stripe
- ❌ Valida o retorno da Api Stripe
- ❌ Envia uma notificação para usuário de pagamento confirmado
- ❌ Envia uma notificação para o admin de que um usuário fez uma compra
- ❌ Retorna 204, sem dados


## Exceções

- ❌ Retorna erro 404 se o endpoint não existir
- ❌ Retorna erro 400 se algum dos dados requeridos não for informado pelo client
- ❌ Retorna erro 400 se o client informar mais dados do que os requeridos
- ❌ Retorna erro 400 se o tipo do dado informado não for válido
- ❌ Retorna erro 400 se algum dos dados informados não for válido
- ❌ Retorna erro 400 se o usuário não tiver produtos no carrinho
- ❌ Retorna erro 401 se o client não informar o token ou se for inválido
- ❌ Retorna erro 500 se der erro ao tentar decriptar token do usuário
- ❌ Retorna erro 500 se der erro ao tentar gerar um id para a compra
- ❌ Retorna erro 500 se der erro ao tentar salvar os dados da compra no DB
- ❌ Retorna erro 500 se der erro ao tentar conectar com a Api Stripe
- ❌ Salva o erro no DB caso ocorra alguma exceção ao enviar notificação



