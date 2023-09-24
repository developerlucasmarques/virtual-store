import type { EventManager, EventManagerData, TransactionEventData, TransactionEventType, TransactionManagerData } from '@/domain/usecases-contracts'
import type { LoadPurchaseIntentByIdRepo, LoadUserByIdRepo, TransactionListenerGateway, TransactionListenerGatewayData, TransactionListenerGatewayResponse, TransactionListenerGatewayValue } from '@/interactions/contracts'
import { TransactionManagerUseCase } from './transaction-manager-usecase'
import { EventNotProcessError, GatewayExceptionError, GatewayIncompatibilityError, PurchaseIntentNotFoundError, UserNotFoundError } from '@/domain/usecases-contracts/errors'
import type { PurchaseIntentModel, UserModel } from '@/domain/models'
import { type Either, right, left } from '@/shared/either'

const makeFakeTransactionManagerData = (): TransactionManagerData => ({
  payload: {
    field: 'any_value'
  },
  signature: 'any_signature'
})

const makeFakeTransactionListenerGatewayValue = (): TransactionListenerGatewayValue => ({
  purchaseIntentId: 'any_purchase_intent_id',
  userId: 'any_user_id',
  eventType: 'CheckoutCompleted'
})

const makeFakeUserModel = (): UserModel => ({
  id: 'any_user_id',
  name: 'any name',
  email: 'any_email@mail.com',
  password: 'hashed_password',
  role: 'admin',
  accessToken: 'any_token'
})

const makeFakePurchaseIntentModel = (): PurchaseIntentModel => ({
  id: 'any_purchase_intent_id',
  userId: 'any_user_id',
  orderCode: 'any_order_code',
  createdAt: new Date(),
  updatedAt: new Date(),
  products: [{
    id: 'any_product_id',
    name: 'any name',
    amount: 10.90,
    quantity: 1
  }]
})

const makeFakeEventManagerData = (): EventManagerData<
TransactionEventType, TransactionEventData> => ({
  eventType: 'CheckoutCompleted',
  eventData: {
    userId: 'any_user_id',
    userName: 'any name',
    userEmail: 'any_email@mail.com',
    orderCode: 'any_order_code',
    products: [{
      id: 'any_product_id',
      name: 'any name',
      amount: 10.90,
      quantity: 1
    }]
  }
})

const makeTransactionListenerGateway = (): TransactionListenerGateway => {
  class TransactionListenerGatewayStub implements TransactionListenerGateway {
    async listener (data: TransactionListenerGatewayData): Promise<TransactionListenerGatewayResponse> {
      return await Promise.resolve(right(makeFakeTransactionListenerGatewayValue()))
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

const makeLoadPurchaseIntentByIdRepo = (): LoadPurchaseIntentByIdRepo => {
  class LoadPurchaseIntentByIdRepoStub implements LoadPurchaseIntentByIdRepo {
    async loadById (id: string): Promise<null | PurchaseIntentModel> {
      return await Promise.resolve(makeFakePurchaseIntentModel())
    }
  }
  return new LoadPurchaseIntentByIdRepoStub()
}

const makeEventManager = (): EventManager<TransactionEventType, TransactionEventData> => {
  class EventManagerStub implements EventManager<TransactionEventType, TransactionEventData> {
    async perform (data: EventManagerData<TransactionEventType, TransactionEventData>): Promise<Either<Error, null>> {
      return await Promise.resolve(right(null))
    }
  }
  return new EventManagerStub()
}

type SutTypes = {
  sut: TransactionManagerUseCase
  transactionListenerGatewayStub: TransactionListenerGateway
  loadUserByIdRepoStub: LoadUserByIdRepo
  loadPurchaseIntentByIdRepoStub: LoadPurchaseIntentByIdRepo
  eventManagerStub: EventManager<TransactionEventType, TransactionEventData>
}

const makeSut = (): SutTypes => {
  const transactionListenerGatewayStub = makeTransactionListenerGateway()
  const loadUserByIdRepoStub = makeLoadUserByIdRepo()
  const loadPurchaseIntentByIdRepoStub = makeLoadPurchaseIntentByIdRepo()
  const eventManagerStub = makeEventManager()
  const sut = new TransactionManagerUseCase(
    transactionListenerGatewayStub,
    loadUserByIdRepoStub,
    loadPurchaseIntentByIdRepoStub,
    eventManagerStub
  )
  return {
    sut,
    transactionListenerGatewayStub,
    loadUserByIdRepoStub,
    loadPurchaseIntentByIdRepoStub,
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
      Promise.resolve(left(new GatewayIncompatibilityError('any_stack')))
    )
    const result = await sut.perform(makeFakeTransactionManagerData())
    expect(result.value).toEqual(new GatewayIncompatibilityError('any_stack'))
  })

  it('Should return EventNotProcessError if TransactionListenerGateway returns EventNotProcessError', async () => {
    const { sut, transactionListenerGatewayStub } = makeSut()
    jest.spyOn(transactionListenerGatewayStub, 'listener').mockReturnValueOnce(
      Promise.resolve(left(new EventNotProcessError('any_event')))
    )
    const result = await sut.perform(makeFakeTransactionManagerData())
    expect(result.value).toEqual(new EventNotProcessError('any_event'))
  })

  it('Should return GatewayExceptionError if TransactionListenerGateway returns GatewayExceptionError', async () => {
    const { sut, transactionListenerGatewayStub } = makeSut()
    jest.spyOn(transactionListenerGatewayStub, 'listener').mockReturnValueOnce(
      Promise.resolve(left(new GatewayExceptionError('any_event')))
    )
    const result = await sut.perform(makeFakeTransactionManagerData())
    expect(result.value).toEqual(new GatewayExceptionError('any_event'))
  })

  it('Should throw if TransactionListenerGateway throws', async () => {
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

  it('Should return UserNotFoundError if LoadUsertByIdRepo returns null', async () => {
    const { sut, loadUserByIdRepoStub } = makeSut()
    jest.spyOn(loadUserByIdRepoStub, 'loadById').mockReturnValueOnce(
      Promise.resolve(null)
    )
    const result = await sut.perform(makeFakeTransactionManagerData())
    expect(result.value).toEqual(new UserNotFoundError())
  })

  it('Should throw if LoadUsertById throws', async () => {
    const { sut, loadUserByIdRepoStub } = makeSut()
    jest.spyOn(loadUserByIdRepoStub, 'loadById').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const promise = sut.perform(makeFakeTransactionManagerData())
    await expect(promise).rejects.toThrow()
  })

  test('Should call LoadPurchaseIntentByIdRepo with correct purchase intent id', async () => {
    const { sut, loadPurchaseIntentByIdRepoStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadPurchaseIntentByIdRepoStub, 'loadById')
    await sut.perform(makeFakeTransactionManagerData())
    expect(loadByIdSpy).toHaveBeenCalledWith('any_purchase_intent_id')
  })

  test('Should call LoadPurchaseIntentByIdRepo only once', async () => {
    const { sut, loadPurchaseIntentByIdRepoStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadPurchaseIntentByIdRepoStub, 'loadById')
    await sut.perform(makeFakeTransactionManagerData())
    expect(loadByIdSpy).toHaveBeenCalledTimes(1)
  })

  it('Should return PurchaseIntentNotFoundError if LoadPurchaseIntentByIdRepo returns null', async () => {
    const { sut, loadPurchaseIntentByIdRepoStub } = makeSut()
    jest.spyOn(loadPurchaseIntentByIdRepoStub, 'loadById').mockReturnValueOnce(
      Promise.resolve(null)
    )
    const result = await sut.perform(makeFakeTransactionManagerData())
    expect(result.value).toEqual(new PurchaseIntentNotFoundError('any_purchase_intent_id'))
  })

  it('Should throw if LoadPurchaseIntentByIdRepo throws', async () => {
    const { sut, loadPurchaseIntentByIdRepoStub } = makeSut()
    jest.spyOn(loadPurchaseIntentByIdRepoStub, 'loadById').mockReturnValueOnce(
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

  test('Should call EventManager only once', async () => {
    const { sut, eventManagerStub } = makeSut()
    const performSpy = jest.spyOn(eventManagerStub, 'perform')
    await sut.perform(makeFakeTransactionManagerData())
    expect(performSpy).toHaveBeenCalledTimes(1)
  })

  it('Should return the same error as EventManager if it returns an error', async () => {
    const { sut, eventManagerStub } = makeSut()
    jest.spyOn(eventManagerStub, 'perform').mockReturnValueOnce(
      Promise.resolve(left(new Error('any_message')))
    )
    const result = await sut.perform(makeFakeTransactionManagerData())
    expect(result.value).toEqual(new Error('any_message'))
  })

  it('Should throw if EventManager throws', async () => {
    const { sut, eventManagerStub } = makeSut()
    jest.spyOn(eventManagerStub, 'perform').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const promise = sut.perform(makeFakeTransactionManagerData())
    await expect(promise).rejects.toThrow()
  })

  it('Should return null if EventManager is a success', async () => {
    const { sut } = makeSut()
    const result = await sut.perform(makeFakeTransactionManagerData())
    expect(result.value).toBeNull()
  })
})
