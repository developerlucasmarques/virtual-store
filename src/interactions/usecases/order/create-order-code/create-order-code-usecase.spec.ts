import { CreateOrderCodeUseCase } from './create-order-code-usecase'

describe('CreateOrderCode UseCase', () => {
  it('Should create order code with 15 characters', async () => {
    const sut = new CreateOrderCodeUseCase()
    const result = await sut.perform('any_user_id_1234')
    expect(result.code.length).toBe(15)
  })
})
