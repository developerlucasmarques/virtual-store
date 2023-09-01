# Add Product To Cart

## Request Body
* productId
* numProducts

## Request Headers
* x-access-token

## Caso de Sucesso

- ❌ Recebe uma requisição do tipo POST na rota /api/cart/add
- ❌ Valida se a requisição foi feita por um usuário
- ❌ Valida os dados obrigatórios
- ❌ Valida o tipo do dado informado
- ❌ Valida se não há dados a mais dos requeridos
- ❌ Gera um ID para o carrinho
- ❌ Salva o carrinho no DB com os dados fornecidos
- ❌ Retorna 204, sem dados


## Exceções

- ❌ Retorna erro 404 se o endpoint não existir
- ❌ Retorna erro 400 se algum dos dados requeridos não for informado pelo client
- ❌ Retorna erro 400 se o client informar mais dados do que os requeridos
- ❌ Retorna erro 400 se o tipo do dado informado não for válido
- ❌ Retorna erro 400 se algum dos dados informados não for válido
- ❌ Retorna erro 401 se o client não informar o token ou se for inválido
- ❌ Retorna erro 500 se der erro ao tentar gerar um id para o carrinho
- ❌ Retorna erro 500 se der erro ao tentar salvar os dados do carrinho no DB



