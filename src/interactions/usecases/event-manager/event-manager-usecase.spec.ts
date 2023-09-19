import type { Event, EventManagerData, TransactionEventData } from '@/domain/usecases-contracts'
import { EventNotFoundError } from '@/domain/usecases-contracts/errors'
import { left, right, type Either } from '@/shared/either'
import { EventManagerUseCase } from './event-manager-usecase'

const makeFakeEventManagerDataWithTypePaymentSuccess = (): EventManagerData<TransactionEventData> => ({
  eventType: 'PaymentSuccess',
  eventData: {
    purchaseIntentId: 'any_purchase_intent_id',
    userEmail: 'any_email@mail.com',
    userId: 'any_user_id',
    userName: 'any name'
  }
})

type AnyEventPaymentSuccessData = {
  userId: string
  userEmail: string
}

const makeAnyEventPaymentSuccess = (): Event<AnyEventPaymentSuccessData> => {
  class AnyEventPaymentSuccessStub implements Event<AnyEventPaymentSuccessData> {
    reqProps: Array<keyof AnyEventPaymentSuccessData> = ['userEmail', 'userId']
    async perform (data: AnyEventPaymentSuccessData): Promise<Either<Error, null>> {
      return right(null)
    }
  }
  return new AnyEventPaymentSuccessStub()
}

type AnotherEventPaymentSuccessData = {
  userEmail: string
  userId: string
  userName: string
}

const makeAnotherEventPaymentSuccess = (): Event<AnotherEventPaymentSuccessData> => {
  class AnotherEventPaymentSuccessStub implements Event<AnotherEventPaymentSuccessData> {
    reqProps: Array<keyof AnotherEventPaymentSuccessData> = ['userEmail', 'userId', 'userName']
    async perform (data: AnotherEventPaymentSuccessData): Promise<Either<Error, null>> {
      return right(null)
    }
  }
  return new AnotherEventPaymentSuccessStub()
}

type SutTypes = {
  sut: EventManagerUseCase<TransactionEventData>
  anyEventPaymentSuccessStub: Event<AnyEventPaymentSuccessData>
  anotherEventPaymentSuccessStub: Event<AnotherEventPaymentSuccessData>
}

const makeSut = (): SutTypes => {
  const anyEventPaymentSuccessStub = makeAnyEventPaymentSuccess()
  const anotherEventPaymentSuccessStub = makeAnotherEventPaymentSuccess()
  const sut = new EventManagerUseCase({
    PaymentSuccess: [anyEventPaymentSuccessStub, anotherEventPaymentSuccessStub],
    PaymentFailure: []
  })
  return { sut, anyEventPaymentSuccessStub, anotherEventPaymentSuccessStub }
}

describe('EventManager UseCase', () => {
  it('Should call AnyEventPaymentSuccess with correct values', async () => {
    const { sut, anyEventPaymentSuccessStub } = makeSut()
    const performSpy = jest.spyOn(anyEventPaymentSuccessStub, 'perform')
    await sut.perform(makeFakeEventManagerDataWithTypePaymentSuccess())
    expect(performSpy).toHaveBeenCalledWith({
      userId: 'any_user_id',
      userEmail: 'any_email@mail.com'
    })
  })

  it('Should call AnyEventPaymentSuccess only once', async () => {
    const { sut, anyEventPaymentSuccessStub } = makeSut()
    const performSpy = jest.spyOn(anyEventPaymentSuccessStub, 'perform')
    await sut.perform(makeFakeEventManagerDataWithTypePaymentSuccess())
    expect(performSpy).toHaveBeenCalledTimes(1)
  })

  it('Should return an Error if AnyEventPaymentSuccess fails', async () => {
    const { sut, anyEventPaymentSuccessStub } = makeSut()
    jest.spyOn(anyEventPaymentSuccessStub, 'perform').mockReturnValueOnce(
      Promise.resolve(left(new Error('any_message')))
    )
    const result = await sut.perform(makeFakeEventManagerDataWithTypePaymentSuccess())
    expect(result.value).toEqual(new Error('any_message'))
  })

  it('Should return EventNotFoundError if there is no event of the same type', async () => {
    const { sut } = makeSut()
    const result = await sut.perform({
      eventType: 'PaymentFailure',
      eventData: makeFakeEventManagerDataWithTypePaymentSuccess().eventData
    })
    expect(result.value).toEqual(new EventNotFoundError())
  })

  it('Should throw if AnyEventPaymentSuccess throws', async () => {
    const { sut, anyEventPaymentSuccessStub } = makeSut()
    jest.spyOn(anyEventPaymentSuccessStub, 'perform').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const promise = sut.perform(makeFakeEventManagerDataWithTypePaymentSuccess())
    await expect(promise).rejects.toThrow()
  })

  it('Should call AnotherEventPaymentSuccess with correct values', async () => {
    const { sut, anotherEventPaymentSuccessStub } = makeSut()
    const performSpy = jest.spyOn(anotherEventPaymentSuccessStub, 'perform')
    await sut.perform(makeFakeEventManagerDataWithTypePaymentSuccess())
    expect(performSpy).toHaveBeenCalledWith({
      userId: 'any_user_id',
      userEmail: 'any_email@mail.com',
      userName: 'any name'
    })
  })

  it('Should call AnotherEventPaymentSuccess only once', async () => {
    const { sut, anotherEventPaymentSuccessStub } = makeSut()
    const performSpy = jest.spyOn(anotherEventPaymentSuccessStub, 'perform')
    await sut.perform(makeFakeEventManagerDataWithTypePaymentSuccess())
    expect(performSpy).toHaveBeenCalledTimes(1)
  })

  it('Should return an Error if AnotherEventPaymentSuccess fails', async () => {
    const { sut, anotherEventPaymentSuccessStub } = makeSut()
    jest.spyOn(anotherEventPaymentSuccessStub, 'perform').mockReturnValueOnce(
      Promise.resolve(left(new Error('any_message')))
    )
    const result = await sut.perform(makeFakeEventManagerDataWithTypePaymentSuccess())
    expect(result.value).toEqual(new Error('any_message'))
  })

  it('Should throw if AnotherEventPaymentSuccess throws', async () => {
    const { sut, anotherEventPaymentSuccessStub } = makeSut()
    jest.spyOn(anotherEventPaymentSuccessStub, 'perform').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const promise = sut.perform(makeFakeEventManagerDataWithTypePaymentSuccess())
    await expect(promise).rejects.toThrow()
  })

  it('Should return the first error if any event returns an error', async () => {
    const { sut, anyEventPaymentSuccessStub, anotherEventPaymentSuccessStub } = makeSut()
    jest.spyOn(anyEventPaymentSuccessStub, 'perform').mockReturnValueOnce(
      Promise.resolve(left(new Error('any_message')))
    )
    jest.spyOn(anotherEventPaymentSuccessStub, 'perform').mockReturnValueOnce(
      Promise.resolve(left(new Error('another_message')))
    )
    const result = await sut.perform(makeFakeEventManagerDataWithTypePaymentSuccess())
    expect(result.value).toEqual(new Error('any_message'))
  })

  it('Should return null if Events are a success', async () => {
    const { sut } = makeSut()
    const result = await sut.perform(makeFakeEventManagerDataWithTypePaymentSuccess())
    expect(result.value).toBeNull()
  })
})
