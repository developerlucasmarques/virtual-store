import type { Event, EventManagerData } from '@/domain/usecases-contracts'
import { EventNotFoundError } from '@/domain/usecases-contracts/errors'
import { EventManagerUseCase } from './event-manager-usecase'

type AnyEventType = 'AnyEventType' | 'AnotherEventType'

type AnyEventGeneralData = {
  anyfield: string
  anotherField: string
  someField: string
}

type AnyEventData = {
  anyfield: string
  anotherField: string
}

type AnotherEventData = {
  anyfield: string
  someField: string
}

const makeFakeEventManagerData = (): EventManagerData<AnyEventType, AnyEventGeneralData> => ({
  eventType: 'AnyEventType',
  eventData: {
    anyfield: 'any_value',
    anotherField: 'another_value',
    someField: 'some_value'
  }
})

const makeAnyEvent = (): Event<AnyEventData> => {
  class AnyEventStub implements Event<AnyEventData> {
    requiredProps: Array<keyof AnyEventData> = ['anyfield', 'anotherField']
    async perform (data: AnyEventData): Promise<void> {
      await Promise.resolve()
    }
  }
  return new AnyEventStub()
}

const makeAnotherEvent = (): Event<AnotherEventData> => {
  class AnotherEventStub implements Event<AnotherEventData> {
    requiredProps: Array<keyof AnotherEventData> = ['anyfield', 'someField']
    async perform (data: AnotherEventData): Promise<void> {
      await Promise.resolve()
    }
  }
  return new AnotherEventStub()
}

type SutTypes = {
  sut: EventManagerUseCase<AnyEventType, AnyEventGeneralData>
  anyEventStub: Event<AnyEventData>
  anotherEventStub: Event<AnotherEventData>
}

const makeSut = (): SutTypes => {
  const anyEventStub = makeAnyEvent()
  const anotherEventStub = makeAnotherEvent()
  const sut = new EventManagerUseCase<AnyEventType, AnyEventGeneralData>({
    AnyEventType: [anyEventStub, anotherEventStub],
    AnotherEventType: []
  })
  return {
    sut,
    anyEventStub,
    anotherEventStub
  }
}

describe('EventManager UseCase', () => {
  it('Should call AnyEvent with correct values', async () => {
    const { sut, anyEventStub } = makeSut()
    const performSpy = jest.spyOn(anyEventStub, 'perform')
    await sut.perform(makeFakeEventManagerData())
    expect(performSpy).toHaveBeenCalledWith({
      anyfield: 'any_value',
      anotherField: 'another_value'
    })
  })

  it('Should call AnyEvent only once', async () => {
    const { sut, anyEventStub } = makeSut()
    const performSpy = jest.spyOn(anyEventStub, 'perform')
    await sut.perform(makeFakeEventManagerData())
    expect(performSpy).toHaveBeenCalledTimes(1)
  })

  it('Should return EventNotFoundError if there is no event of the same type', async () => {
    const { sut } = makeSut()
    const result = await sut.perform({
      eventType: 'AnotherEventType',
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

  it('Should call AnotherEvent with correct values', async () => {
    const { sut, anotherEventStub } = makeSut()
    const performSpy = jest.spyOn(anotherEventStub, 'perform')
    await sut.perform(makeFakeEventManagerData())
    expect(performSpy).toHaveBeenCalledWith({
      anyfield: 'any_value',
      someField: 'some_value'
    })
  })

  it('Should call AnotherEvent only once', async () => {
    const { sut, anotherEventStub } = makeSut()
    const performSpy = jest.spyOn(anotherEventStub, 'perform')
    await sut.perform(makeFakeEventManagerData())
    expect(performSpy).toHaveBeenCalledTimes(1)
  })

  it('Should throw if AnotherEvent throws', async () => {
    const { sut, anotherEventStub } = makeSut()
    jest.spyOn(anotherEventStub, 'perform').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const promise = sut.perform(makeFakeEventManagerData())
    await expect(promise).rejects.toThrow()
  })

  it('Should return null if Events are a success', async () => {
    const { sut } = makeSut()
    const result = await sut.perform(makeFakeEventManagerData())
    expect(result.value).toBeNull()
  })
})
