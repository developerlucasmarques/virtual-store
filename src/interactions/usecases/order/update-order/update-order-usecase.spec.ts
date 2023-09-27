import type { UpdateOrderData } from '@/domain/usecases-contracts'
import { UpdateOrderUseCase } from './update-order-usecase'
import { MissingStatusError } from '@/domain/usecases-contracts/errors'

const makeFakeUpdateOrderData = (): UpdateOrderData => ({
  orderId: 'any_order_id'
})

describe('UpdateOrder UseCase', () => {
  it('Should return MissingStatusError if status and payment status not informed', async () => {
    const sut = new UpdateOrderUseCase()
    const result = await sut.perform(makeFakeUpdateOrderData())
    expect(result.value).toEqual(new MissingStatusError())
  })
})
