import type { EventManager, Event, AddOrder, AddOrderData, AddOrderResponse, EventManagerData } from '@/domain/usecases-contracts'
import { EventManagerUseCase } from './event-manager-usecase'
import { left, right } from '@/shared/either'
import { PurchaseIntentNotFoundError } from '@/domain/usecases-contracts/errors'

const makeFakeEventManagerData = (): EventManagerData => ({
  eventName: 'PaymentSuccess',
  eventData: {
    userId: 'any_user_id',
    userName: 'any_user_name',
    userEmail: 'any_user_email',
    purchaseIntentId: 'any_purchase_intent_id'
  }
})

const makeAddOrder = (): Event<AddOrderData> => {
  class AddOrderStub implements AddOrder, Event<AddOrderData> {
    reqProps: Array<keyof AddOrderData> = ['purchaseIntentId', 'userId']
    async perform (data: AddOrderData): Promise<AddOrderResponse> {
      return right(null)
    }
  }
  return new AddOrderStub()
}

export type SutTypes = {
  sut: EventManager
  addOrderStub: Event<AddOrderData>
}

const makeSut = (): SutTypes => {
  const addOrderStub = makeAddOrder()
  const sut = new EventManagerUseCase(addOrderStub)
  return {
    sut,
    addOrderStub
  }
}

describe('EventManager UseCase', () => {
  it('Should call AddOrder with correct values', async () => {
    const { sut, addOrderStub } = makeSut()
    const performSpy = jest.spyOn(addOrderStub, 'perform')
    await sut.handle(makeFakeEventManagerData())
    expect(performSpy).toHaveBeenCalledWith({
      userId: 'any_user_id',
      purchaseIntentId: 'any_purchase_intent_id'
    })
  })

  it('Should call AddOrder only once', async () => {
    const { sut, addOrderStub } = makeSut()
    const performSpy = jest.spyOn(addOrderStub, 'perform')
    await sut.handle(makeFakeEventManagerData())
    expect(performSpy).toHaveBeenCalledTimes(1)
  })

  it('Should return PurchaseIntentNotFoundError if AddOrder fails', async () => {
    const { sut, addOrderStub } = makeSut()
    jest.spyOn(addOrderStub, 'perform').mockReturnValueOnce(
      Promise.resolve(left(new PurchaseIntentNotFoundError('any_purchase_intent_id')))
    )
    const result = await sut.handle(makeFakeEventManagerData())
    expect(result.value).toEqual(new PurchaseIntentNotFoundError('any_purchase_intent_id'))
  })

  it('Should throw if AddOrder throws', async () => {
    const { sut, addOrderStub } = makeSut()
    jest.spyOn(addOrderStub, 'perform').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const promise = sut.handle(makeFakeEventManagerData())
    await expect(promise).rejects.toThrow()
  })

  it('Should return null if AddOrder is a success', async () => {
    const { sut } = makeSut()
    const result = await sut.handle(makeFakeEventManagerData())
    expect(result.value).toBeNull()
  })
})
