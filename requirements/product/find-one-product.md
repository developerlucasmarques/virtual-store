# Find One Product

## Path Parameters
* productId

## Caso de Sucesso

- ❌ Recebe uma requisição do tipo GET na rota /api/product/:productId
- ❌ Valida se o **productId** recebido é do tipo de ID esperado
- ❌ Retorna 200 com os dados do produto


## Exceções

- ❌ Retorna erro 404 se a API não existir
- ❌ Retorna erro 404 se não encontrou o produto
- ❌ Retorna erro 400 se o tipo de ID informado não for o mesmo que é esperado
- ❌ Retorna erro 500 se der erro ao tentar buscar o produto



