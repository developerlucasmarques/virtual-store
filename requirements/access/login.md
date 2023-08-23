# Login

## Dados
* email
* password

## Caso de Sucesso

- ❌ Recebe uma requisição do tipo POST na rota /api/login
- ❌ Valida os dados obrigatórios
- ❌ Valida o tipo do dado informado
- ❌ Valida se não há dados a mais dos requeridos
- ❌ Valida se o campo **email** é um email válido
- ❌ Busca o usuário com o email e senha fornecidos
- ❌ Gera um token criptografado a partir do ID do usuário
- ❌ Atualiza os dados do usuário com o token de acesso gerado
- ❌ Retorna 200 com o token de acesso do usuário


## Exceções

- ❌ Retorna erro 404 se o endpoint não existir
- ❌ Retorna erro 400 se algum dos dados requeridos não for informado pelo client
- ❌ Retorna erro 400 se o client informar mais dados do que os requeridos
- ❌ Retorna erro 400 se o tipo do dado informado não for válido
- ❌ Retorna erro 400 se o campo email for um e-mail inválido
- ❌ Retorna erro 401 se não encontrar um usuário com o email fornecido
- ❌ Retorna erro 401 se a comparação entre o password informado e o password criptografado que está armazenado no DB falhar
- ❌ Retorna erro 500 se der erro comparar o password com o password criptografado
- ❌ Retorna erro 500 se der erro ao tentar gerar o token de acesso
- ❌ Retorna erro 500 se der erro ao tentar atualizar o usuário com o token de acesso gerado




