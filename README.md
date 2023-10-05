# Virtual-Store
API de e-commerce construída adotando arquitetura desacoplada e bem estruturada. Desenvolvida através de Test-Driven Development (TDD), seguindo os princípios do SOLID, Clean Architecture e integrando Design Patterns para aprimorar a resolução de desafios específicos.


## APIs construídas

1. [Cadastro](./requirements/access/signup.md)
2. [Login](./requirements/access/login.md)
3. [Criar Produto](./requirements/product/add-product.md)
4. [Listar Produtos](./requirements/product/load-all-products.md)
5. [Buscar um Produto](./requirements/product/load-one-product.md)
6. [Adicionar Produtos ao Carrinho](./requirements/cart/add-product-to-cart.md)
7. [Buscar Produtos do Carrinho](./requirements/cart/load-cart.md)
8. [Acessar página para Checkout](./requirements/checkout/checkout.md)
9. [Receber Eventos de Webhook do Stripe](./requirements/events/transaction/checkout-completed.md)


## Princípios

- Single Responsibility Principle (SRP)
- Open Closed Principle (OCP)
- Liskov Substitution Principle (LSP)
- Interface Segregation Principle (ISP)
- Dependency Inversion Principle (DIP)
- Separation of Concerns (SOC)
- Don't Repeat Yourself (DRY)
- You Aren't Gonna Need It (YAGNI)
- Keep It Simple, Silly (KISS)
- Composition Over Inheritance
- Small Commits


## Design Patterns

- Factory
- Adapter
- Composite
- Decorator
- Proxy
- Dependency Injection
- Abstract Server
- Composition Root
- Builder
- Singleton


## Metodologias e Designs

- TDD
- Clean Architecture
- DDD
- Conventional Commits
- GitFlow
- Modular Design
- Dependency Diagrams
- Use Cases
- Continuous Integration
- Continuous Delivery
- Continuous Deployment


## Bibliotecas e Ferramentas

- NPM
- Typescript
- Git
- Jest
- MongoDb
- Bcrypt
- JsonWebToken
- Express
- Supertest
- Eslint
- Standard Javascript Style
- Sucrase
- In-Memory MongoDb Server
- Stripe
- Mockdate


## Features do Node

- API Rest com Express
- Log de Erro
- Segurança (Hashing, Encryption e Encoding)
- CORS
- Middlewares


## Features do Git

- Alias
- Log Personalizado
- Branch
- Reset
- Amend
- Tag
- Stash
- Merge


## Features do Typescript

- POO Avançado
- Interface
- TypeAlias
- Utility Types
- Modularização de Paths
- Configurações
- Build


## Features de Testes

- Testes Unitários
- Testes de Integração (API Rest)
- Cobertura de Testes
- Test Doubles
- Mocks
- Stubs
- Spies
- Fakes

## Features do MongoDb

- Connect e Reconnect
- Collections
- InsertOne e InserMany
- Find, FindOne e FindOneAndUpdate
- DeleteMany
- UpdateOne
- ObjectId

## Features do Stripe

- Suporte para métodos de pagamento com cartão de crédito ou débito.
- Processamento seguro de pagamentos com o Stripe.
- Implementação de checkout usando o Stripe Checkout Session.
- Personalização das opções de checkout, como descrição, preço e itens do carrinho.
- Implementação de Webhooks do Stripe para capturar eventos após a conclusão do checkout.
- Validação e processamento de eventos, como pagamento aprovado, pagamento não aprovado.
- Notificações em tempo real de eventos importantes.
- Ambiente de teste para validar e depurar sua integração antes de ir ao ar.
- Testes de unidade e integração para garantir que tudo funcione conforme o esperado.
- Simulação de cenários de pagamento para testar diferentes casos de uso.


## Pré-requisitos

É imprescindível que você tenha instalado em seu computador o NodeJs e o MongDB para que possa executar e testar este projeto.

- **Node** - [https://nodejs.org/en/download/](https://nodejs.org/pt-br/download/)
- **MongoDB** - [https://www.mongodb.com/try/download/community/](https://www.mongodb.com/try/download/community)

## Instalação

 Exemplo:

 Clone esse projeto em seu computador com o comando:

 ```
 	git clone [https://github.com/codedbylucas/virtual-store.git]
 ```

 Acesse a pasta do projeto seu terminal:

 ```
 	cd [virtual-store]
 ```

 Já pasta da aplicação em seu terminal, digite o seguinte comando:

 ```
 	npm install
 ```


## Execução

Após ter configurado o projeto e ter aguardado a instalação das dependencias de desenvolvimento, execute o comando:

```
 	npm start
```

 Caso queira que o projeto rode automaticamente após fazer alguma alteração no código execute o comando:

 ```
 	npm run start:dev
 ```

Para executar todos os testes do projeto execute o comando:

 ```
 	npm test
 ```

Para executar apenas os testes unitários execute o comando:

 ```
 	npm run test:unit
 ```

Para executar apenas os testes de integração execute o comando:

 ```
 	npm run test:integration
 ```

Para visualizar a cobertura de testes do projeto execute o comando:

 ```
 	npm run test:ci
 ```


## Autor

- **Lucas Marques** - Desenvolvedor - [Github](https://github.com/codedbylucas) | [Linkedin](https://www.linkedin.com/in/codedbylucas/)
 
