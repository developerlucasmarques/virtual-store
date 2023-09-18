import type { EventManager, EventManagerData, TransactionManagerData } from '@/domain/usecases-contracts'
import type { LoadUserByIdRepo, TransactionListenerGateway, TransactionListenerGatewayData, TransactionListenerGatewayResponse } from '@/interactions/contracts'
import { TransactionManagerUseCase } from './transaction-manager-usecase'
import { GatewayIncompatibilityError } from '@/domain/usecases-contracts/errors'
import type { UserModel } from '@/domain/models'
import { type Either, right } from '@/shared/either'

const makeFakeTransactionManagerData = (): TransactionManagerData => ({
  payload: {
    field: 'any_value'
  },
  signature: 'any_signature'
})

const makeFakeTransactionListenerGatewayResponse = (): TransactionListenerGatewayResponse => ({
  purchaseIntentId: 'any_purchase_intent_id',
  userId: 'any_user_id',
  eventName: 'PaymentSuccess'
})

const makeFakeUserModel = (): UserModel => ({
  id: 'any_user_id',
  name: 'any name',
  email: 'any_email@mail.com',
  password: 'hashed_password',
  role: 'admin',
  accessToken: 'any_token'
})

const makeFakeEventManagerData = (): EventManagerData => ({
  eventName: 'PaymentSuccess',
  eventData: {
    purchaseIntentId: 'any_purchase_intent_id',
    userId: 'any_user_id',
    userName: 'any name',
    userEmail: 'any_email@mail.com'
  }
})

const makeTransactionListenerGateway = (): TransactionListenerGateway => {
  class TransactionListenerGatewayStub implements TransactionListenerGateway {
    async listener (data: TransactionListenerGatewayData): Promise<TransactionListenerGatewayResponse> {
      return await Promise.resolve(makeFakeTransactionListenerGatewayResponse())
    }
  }
  return new TransactionListenerGatewayStub()
}

const makeLoadUserByIdRepo = (): LoadUserByIdRepo => {
  class LoadUserByIdRepoStub implements LoadUserByIdRepo {
    async loadById (id: string): Promise<null | UserModel> {
      return await Promise.resolve(makeFakeUserModel())
    }
  }
  return new LoadUserByIdRepoStub()
}

const makeEventManager = (): EventManager => {
  class EventManagerStub implements EventManager {
    async perform (data: EventManagerData): Promise<Either<Error, null>> {
      return await Promise.resolve(right(null))
    }
  }
  return new EventManagerStub()
}

type SutTypes = {
  sut: TransactionManagerUseCase
  transactionListenerGatewayStub: TransactionListenerGateway
  loadUserByIdRepoStub: LoadUserByIdRepo
  eventManagerStub: EventManager
}

const makeSut = (): SutTypes => {
  const transactionListenerGatewayStub = makeTransactionListenerGateway()
  const loadUserByIdRepoStub = makeLoadUserByIdRepo()
  const eventManagerStub = makeEventManager()
  const sut = new TransactionManagerUseCase(
    transactionListenerGatewayStub, loadUserByIdRepoStub, eventManagerStub
  )
  return {
    sut,
    transactionListenerGatewayStub,
    loadUserByIdRepoStub,
    eventManagerStub
  }
}

describe('TransactionManager UseCase', () => {
  it('Should call TransactionListenerGateway with correct values', async () => {
    const { sut, transactionListenerGatewayStub } = makeSut()
    const listenerSpy = jest.spyOn(transactionListenerGatewayStub, 'listener')
    await sut.perform(makeFakeTransactionManagerData())
    expect(listenerSpy).toHaveBeenCalledWith(makeFakeTransactionManagerData())
  })

  it('Should call TransactionListenerGateway only once', async () => {
    const { sut, transactionListenerGatewayStub } = makeSut()
    const listenerSpy = jest.spyOn(transactionListenerGatewayStub, 'listener')
    await sut.perform(makeFakeTransactionManagerData())
    expect(listenerSpy).toHaveBeenCalledTimes(1)
  })

  it('Should return GatewayIncompatibilityError if TransactionListenerGateway returns null', async () => {
    const { sut, transactionListenerGatewayStub } = makeSut()
    jest.spyOn(transactionListenerGatewayStub, 'listener').mockReturnValueOnce(
      Promise.resolve(null)
    )
    const result = await sut.perform(makeFakeTransactionManagerData())
    expect(result.value).toEqual(new GatewayIncompatibilityError())
  })

  it('Should throw if GatewayIncompatibilityError throws', async () => {
    const { sut, transactionListenerGatewayStub } = makeSut()
    jest.spyOn(transactionListenerGatewayStub, 'listener').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const promise = sut.perform(makeFakeTransactionManagerData())
    await expect(promise).rejects.toThrow()
  })

  test('Should call LoadUsertByIdRepo with correct user id', async () => {
    const { sut, loadUserByIdRepoStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadUserByIdRepoStub, 'loadById')
    await sut.perform(makeFakeTransactionManagerData())
    expect(loadByIdSpy).toHaveBeenCalledWith('any_user_id')
  })

  test('Should call LoadUsertByIdRepo only once', async () => {
    const { sut, loadUserByIdRepoStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadUserByIdRepoStub, 'loadById')
    await sut.perform(makeFakeTransactionManagerData())
    expect(loadByIdSpy).toHaveBeenCalledTimes(1)
  })

  it('Should throw if LoadUsertById throws', async () => {
    const { sut, loadUserByIdRepoStub } = makeSut()
    jest.spyOn(loadUserByIdRepoStub, 'loadById').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const promise = sut.perform(makeFakeTransactionManagerData())
    await expect(promise).rejects.toThrow()
  })

  test('Should call EventManager with correct values', async () => {
    const { sut, eventManagerStub } = makeSut()
    const performSpy = jest.spyOn(eventManagerStub, 'perform')
    await sut.perform(makeFakeTransactionManagerData())
    expect(performSpy).toHaveBeenCalledWith(makeFakeEventManagerData())
  })
})
