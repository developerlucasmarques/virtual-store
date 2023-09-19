import type { AddOrderData, AddOrderResponse, Event, EventManagerData } from '@/domain/usecases-contracts'
import { EventNotFoundError, PurchaseIntentNotFoundError } from '@/domain/usecases-contracts/errors'
import { left, right } from '@/shared/either'
import { EventManagerUseCase } from './event-manager-usecase'

const makeFakeEventManagerData = (): EventManagerData => ({
  eventType: 'PaymentSuccess',
  eventData: {
    purchaseIntentId: 'any_purchase_intent_id',
    userEmail: 'any_email@mail.com',
    userId: 'any_user_id',
    userName: 'any name'
  }
})

const makeAddOrder = (): Event<AddOrderData> => {
  class AddOrderStub implements Event<AddOrderData> {
    reqProps: Array<keyof AddOrderData> = ['purchaseIntentId', 'userId']
    async perform (data: AddOrderData): Promise<AddOrderResponse> {
      return right(null)
    }
  }
  return new AddOrderStub()
}

type SutTypes = {
  sut: EventManagerUseCase
  addOrderStub: Event<AddOrderData>
}

const makeSut = (): SutTypes => {
  const addOrderStub = makeAddOrder()
  const sut = new EventManagerUseCase([
    {
      PaymentSuccess: [{ event: addOrderStub }],
      PaymentFailure: []
    }
  ])
  return { sut, addOrderStub }
}

describe('EventManager UseCase', () => {
  it('Should call AddOrder with correct values', async () => {
    const { sut, addOrderStub } = makeSut()
    const performSpy = jest.spyOn(addOrderStub, 'perform')
    await sut.perform(makeFakeEventManagerData())
    expect(performSpy).toHaveBeenCalledWith({
      userId: 'any_user_id',
      purchaseIntentId: 'any_purchase_intent_id'
    })
  })

  it('Should call AddOrder only once', async () => {
    const { sut, addOrderStub } = makeSut()
    const performSpy = jest.spyOn(addOrderStub, 'perform')
    await sut.perform(makeFakeEventManagerData())
    expect(performSpy).toHaveBeenCalledTimes(1)
  })

  it('Should return PurchaseIntentNotFoundError if AddOrder fails', async () => {
    const { sut, addOrderStub } = makeSut()
    jest.spyOn(addOrderStub, 'perform').mockReturnValueOnce(
      Promise.resolve(left(new PurchaseIntentNotFoundError('any_purchase_intent_id')))
    )
    const result = await sut.perform(makeFakeEventManagerData())
    expect(result.value).toEqual(new PurchaseIntentNotFoundError('any_purchase_intent_id'))
  })

  it('Should return EventNotFoundError if there is no event of the same type', async () => {
    const { sut } = makeSut()
    const result = await sut.perform({
      eventType: 'PaymentFailure',
      eventData: makeFakeEventManagerData().eventData
    })
    expect(result.value).toEqual(new EventNotFoundError())
  })

  it('Should throw if AddOrder throws', async () => {
    const { sut, addOrderStub } = makeSut()
    jest.spyOn(addOrderStub, 'perform').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const promise = sut.perform(makeFakeEventManagerData())
    await expect(promise).rejects.toThrow()
  })

  it('Should return null if AddOrder is a success', async () => {
    const { sut } = makeSut()
    const result = await sut.perform(makeFakeEventManagerData())
    expect(result.value).toBeNull()
  })
})
