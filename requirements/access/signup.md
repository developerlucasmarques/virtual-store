# SignUp

## Dados
* name
* email
* password
* passwordConfirmation

## Caso de Sucesso

- ❌ Recebe uma requisição do tipo POST na rota /api/signup
- ❌ Valida os dados obrigatórios
- ❌ Valida o tipo do dado informado
- ❌ Valida se não há dados a mais dos requeridos
- ❌ Valida se **password** e **passwordConfirmation** são iguais
- ❌ Valida se o campo **email** é um email válido
- ❌ Valida se já existe um usuário com o email fornecido
- ❌ Gera uma senha criptografada
- ❌ Gera um ID para o usuário
- ❌ Gera um token criptografado a partir do ID do usuário
- ❌ Salva os dados do usuário
- ❌ Retorna 201 com o token de acesso do usuário


## Exceções

- ❌ Retorna erro 404 se o endpoint não existir
- ❌ Retorna erro 400 se algum dos dados requeridos não for informado pelo client
- ❌ Retorna erro 400 se o client informar mais dados do que os requeridos
- ❌ Retorna erro 400 se o tipo do dado informado não for válido
- ❌ Retorna erro 400 se o **password** e **passwordConfirmation** não forem iguais
- ❌ Retorna erro 400 se o campo **email** for inválido
- ❌ Retorna erro 400 se o email fornecido já estiver em uso
- ❌ Retorna erro 500 se der erro ao tentar gerar uma senha criptografada
- ❌ Retorna erro 500 se der erro ao tentar gerar o token de acesso
- ❌ Retorna erro 500 se der erro ao tentar criar a conta do usuário



