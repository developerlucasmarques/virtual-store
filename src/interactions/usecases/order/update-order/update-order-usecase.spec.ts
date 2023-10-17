import type { PaymentStatusOfOrderModel, StatusOfOrderModel } from '@/domain/models'
import type { UpdateOrderData } from '@/domain/usecases-contracts'
import type { UpdateOrderRepo, UpdateOrderRepoData } from '@/interactions/contracts'
import MockDate from 'mockdate'
import { UpdateOrderUseCase } from './update-order-usecase'

const makeFakeUpdateOrderData = (): UpdateOrderData => ({
  orderId: 'any_order_id'
})

const status: StatusOfOrderModel = 'Processing'
const paymentStatus: PaymentStatusOfOrderModel = 'Payment_Pending'

const makeUpdateOrderRepo = (): UpdateOrderRepo => {
  class UpdateOrderRepoStub implements UpdateOrderRepo {
    async updateById (data: UpdateOrderRepoData): Promise<void> {
      await Promise.resolve()
    }
  }
  return new UpdateOrderRepoStub()
}

type SutTypes = {
  sut: UpdateOrderUseCase
  updateOrderRepoStub: UpdateOrderRepo
}

const makeSut = (
  status?: StatusOfOrderModel, paymentStatus?: PaymentStatusOfOrderModel
): SutTypes => {
  const updateOrderRepoStub = makeUpdateOrderRepo()
  const sut = new UpdateOrderUseCase(updateOrderRepoStub, status, paymentStatus)
  return { sut, updateOrderRepoStub }
}

describe('UpdateOrder UseCase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('Should contain all UpdateOrderData keys in the requiredProps', async () => {
    const { sut } = makeSut()
    const requiredProps: Array<keyof UpdateOrderData> = sut.requiredProps
    const allKeysPresent = Object.keys(makeFakeUpdateOrderData()).every(key =>
      requiredProps.includes(key as keyof UpdateOrderData)
    )
    expect(allKeysPresent).toBe(true)
  })

  it('Should return undefined if StatusOfOrderModel and PaymentStatusOfOrderModel not provided', async () => {
    const { sut } = makeSut()
    const result = sut.perform(makeFakeUpdateOrderData())
    await expect(result).resolves.toBeUndefined()
  })

  it('Should not call UpdateOrderRepo if StatusOfOrderModel and PaymentStatusOfOrderModel not provided', async () => {
    const { sut, updateOrderRepoStub } = makeSut()
    const updateByIdSpy = jest.spyOn(updateOrderRepoStub, 'updateById')
    await sut.perform(makeFakeUpdateOrderData())
    expect(updateByIdSpy).not.toHaveBeenCalled()
  })

  it('Should call UpdateOrderRepo with correct values', async () => {
    const { sut, updateOrderRepoStub } = makeSut(status, paymentStatus)
    const updateByIdSpy = jest.spyOn(updateOrderRepoStub, 'updateById')
    await sut.perform(makeFakeUpdateOrderData())
    expect(updateByIdSpy).toHaveBeenCalledWith({
      id: 'any_order_id',
      status: 'Processing',
      paymentStatus: 'Payment_Pending',
      updatedAt: new Date()
    })
  })

  it('Should call UpdateOrderRepo only once', async () => {
    const { sut, updateOrderRepoStub } = makeSut(status, paymentStatus)
    const updateByIdSpy = jest.spyOn(updateOrderRepoStub, 'updateById')
    await sut.perform(makeFakeUpdateOrderData())
    expect(updateByIdSpy).toHaveBeenCalledTimes(1)
  })

  it('Should throw if UpdateOrderRepo throws', async () => {
    const { sut, updateOrderRepoStub } = makeSut(status, paymentStatus)
    jest.spyOn(updateOrderRepoStub, 'updateById').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const promise = sut.perform(makeFakeUpdateOrderData())
    await expect(promise).rejects.toThrow()
  })

  it('Should return undefined if UpdateOrderRepo is a success', async () => {
    const { sut } = makeSut(status, paymentStatus)
    const result = sut.perform(makeFakeUpdateOrderData())
    await expect(result).resolves.toBeUndefined()
  })
})
