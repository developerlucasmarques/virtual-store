import { type UpdateOrderData } from '@/domain/usecases-contracts'
import { MissingStatusError } from '@/domain/usecases-contracts/errors'
import { UpdateOrderUseCase } from './update-order-usecase'

const makeFakeUpdateOrderData = (): UpdateOrderData => ({
  orderId: 'any_order_id'
})

describe('UpdateOrder UseCase', () => {
  it('Should return MissingStatusError if status and payment status not informed', async () => {
    const sut = new UpdateOrderUseCase()
    const result = await sut.perform(makeFakeUpdateOrderData())
    expect(result.value).toEqual(new MissingStatusError())
  })

  it('Should contain all UpdateOrderData keys in the requiredProps', async () => {
    const sut = new UpdateOrderUseCase()
    const requiredProps: Array<keyof UpdateOrderData> = sut.requiredProps
    const allKeysPresent = Object.keys(makeFakeUpdateOrderData()).every(key =>
      requiredProps.includes(key as keyof UpdateOrderData)
    )
    expect(allKeysPresent).toBe(true)
  })
})
