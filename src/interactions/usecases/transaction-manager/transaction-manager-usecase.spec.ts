import type { TransactionManagerData } from '@/domain/usecases-contracts'
import type { LoadUserByIdRepo, TransactionListenerGateway, TransactionListenerGatewayData, TransactionListenerGatewayResponse } from '@/interactions/contracts'
import { TransactionManagerUseCase } from './transaction-manager-usecase'
import { GatewayIncompatibilityError } from '@/domain/usecases-contracts/errors'
import type { UserModel } from '@/domain/models'

const makeFakeTransactionManagerData = (): TransactionManagerData => ({
  payload: {
    field: 'any_value'
  },
  signature: 'any_signature'
})

const makeFakeUserModel = (): UserModel => ({
  id: 'any_id',
  name: 'any name',
  email: 'any_email@mail.com',
  password: 'hashed_password',
  role: 'admin',
  accessToken: 'any_token'
})

const makeTransactionListenerGateway = (): TransactionListenerGateway => {
  class TransactionListenerGatewayStub implements TransactionListenerGateway {
    async listener (data: TransactionListenerGatewayData): Promise<TransactionListenerGatewayResponse> {
      return await Promise.resolve({
        purchaseIntentId: 'any_purchase_intent_id', userId: 'any_user_id'
      })
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

type SutTypes = {
  sut: TransactionManagerUseCase
  transactionListenerGatewayStub: TransactionListenerGateway
  loadUserByIdRepoStub: LoadUserByIdRepo
}

const makeSut = (): SutTypes => {
  const transactionListenerGatewayStub = makeTransactionListenerGateway()
  const loadUserByIdRepoStub = makeLoadUserByIdRepo()
  const sut = new TransactionManagerUseCase(transactionListenerGatewayStub, loadUserByIdRepoStub)
  return {
    sut,
    transactionListenerGatewayStub,
    loadUserByIdRepoStub
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
    expect(loadByIdSpy).toBeCalledWith('any_user_id')
  })
})
