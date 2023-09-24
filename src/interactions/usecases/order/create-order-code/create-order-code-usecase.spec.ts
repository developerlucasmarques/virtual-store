import { ObjectId } from 'mongodb'
import { CreateOrderCodeUseCase } from './create-order-code-usecase'

describe('CreateOrderCode UseCase', () => {
  it('Should create order code with 15 characters', async () => {
    const sut = new CreateOrderCodeUseCase()
    const id = new ObjectId().toHexString()
    const result = await sut.perform(id)
    expect(result.code.length).toBe(15)
  })
})
