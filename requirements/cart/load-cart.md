# Load Cart

## Request Headers
* x-access-token

## Caso de Sucesso

- ❌ Recebe uma requisição do tipo GET na rota /api/cart
- ❌ Valida se a requisição foi feita por um usuário
- ❌ Busca carrinho do usuário a partir do userId que estiver no token
- ❌ Calcula o valor total dos produtos no carrinho do usuário
- ❌ Retorna 204 se não tiver nenhum produto no carrinho
- ❌ Retorna 200 com os dados dos produtos do carrinho do usuário


## Exceções

- ❌ Retorna erro 404 se a API não existir
- ❌ Retorna erro 500 se der erro ao tentar decriptar token do usuário
- ❌ Retorna erro 500 se der erro ao tentar buscar o carrinho do usuário