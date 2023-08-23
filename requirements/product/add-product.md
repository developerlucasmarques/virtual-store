# Add Product

## Request Body
* name
* image
* amount
* description

## Request Headers
* x-access-token

## Caso de Sucesso

- ❌ Recebe uma requisição do tipo POST na rota /api/product
- ❌ Valida se a requisição foi feita por um admin
- ❌ Valida os dados obrigatórios
- ❌ Valida o tipo do dado informado
- ❌ Valida se não há dados a mais dos requeridos
- ❌ Valida se o campo **image** é um arquivo de imagem
- ❌ Salva arquivo temporarialmente em um diretório no servidor
- ❌ Envia arquivo para AWS S3
- ❌ Exclui o arquivo do diretório temporário
- ❌ Gera um ID para o produto
- ❌ Salva o produto no DB com os dados fornecidos e a url do arquivo na AWS S3
- ❌ Retorna 204, sem dados


## Exceções

- ❌ Retorna erro 404 se o endpoint não existir
- ❌ Retorna erro 400 se algum dos dados requeridos não for informado pelo client
- ❌ Retorna erro 400 se o client informar mais dados do que os requeridos
- ❌ Retorna erro 400 se o tipo do dado informado não for válido
- ❌ Retorna erro 500 se der erro ao tentar gerar um id para o usuário
- ❌ Retorna erro 500 se der erro no processo de salvar imagem na AWS S3
- ❌ Retorna erro 500 se der erro ao tentar salvar o produto no DB
  - ❌ Excluir arquivo salvo na AWS S3 caso aconteça um erro ao salvar o produto no DB



