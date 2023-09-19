import type { AddOrderResponse, Event, EventManagerData } from '@/domain/usecases-contracts'
import { EventNotFoundError } from '@/domain/usecases-contracts/errors'
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

type AnyEventData = {
  userId: string
  userEmail: string
}

const makeAnyEvent = (): Event<AnyEventData> => {
  class AnyEventStub implements Event<AnyEventData> {
    reqProps: Array<keyof AnyEventData> = ['userEmail', 'userId']
    async perform (data: AnyEventData): Promise<AddOrderResponse> {
      return right(null)
    }
  }
  return new AnyEventStub()
}

type SutTypes = {
  sut: EventManagerUseCase
  anyEventStub: Event<AnyEventData>
}

const makeSut = (): SutTypes => {
  const anyEventStub = makeAnyEvent()
  const sut = new EventManagerUseCase([
    {
      PaymentSuccess: [{ event: anyEventStub }],
      PaymentFailure: []
    }
  ])
  return { sut, anyEventStub }
}

describe('EventManager UseCase', () => {
  it('Should call AnyEvent with correct values', async () => {
    const { sut, anyEventStub } = makeSut()
    const performSpy = jest.spyOn(anyEventStub, 'perform')
    await sut.perform(makeFakeEventManagerData())
    expect(performSpy).toHaveBeenCalledWith({
      userId: 'any_user_id',
      userEmail: 'any_email@mail.com'
    })
  })

  it('Should call AnyEvent only once', async () => {
    const { sut, anyEventStub } = makeSut()
    const performSpy = jest.spyOn(anyEventStub, 'perform')
    await sut.perform(makeFakeEventManagerData())
    expect(performSpy).toHaveBeenCalledTimes(1)
  })

  it('Should return an Error if AnyEvent fails', async () => {
    const { sut, anyEventStub } = makeSut()
    jest.spyOn(anyEventStub, 'perform').mockReturnValueOnce(
      Promise.resolve(left(new Error('any_message')))
    )
    const result = await sut.perform(makeFakeEventManagerData())
    expect(result.value).toEqual(new Error('any_message'))
  })

  it('Should return EventNotFoundError if there is no event of the same type', async () => {
    const { sut } = makeSut()
    const result = await sut.perform({
      eventType: 'PaymentFailure',
      eventData: makeFakeEventManagerData().eventData
    })
    expect(result.value).toEqual(new EventNotFoundError())
  })

  it('Should throw if AnyEvent throws', async () => {
    const { sut, anyEventStub } = makeSut()
    jest.spyOn(anyEventStub, 'perform').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const promise = sut.perform(makeFakeEventManagerData())
    await expect(promise).rejects.toThrow()
  })

  it('Should return null if AnyEvent is a success', async () => {
    const { sut } = makeSut()
    const result = await sut.perform(makeFakeEventManagerData())
    expect(result.value).toBeNull()
  })
})
