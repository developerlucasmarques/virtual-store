import { OrderCodeGenerator } from './order-code-generator'

describe('GenerateOrderCode UseCase', () => {
  it('Should generate order code with 15 characters', async () => {
    const sut = new OrderCodeGenerator()
    const result = await sut.execute('any_user_id_1234')
    expect(result.code.length).toBe(15)
  })
})
