import type { TransactionManagerData } from '@/domain/usecases-contracts'
import type { TransactionListenerGateway, TransactionListenerGatewayData, TransactionListenerGatewayResponse } from '@/interactions/contracts'
import { TransactionManagerUseCase } from './transaction-manager-usecase'

const makeFakeTransactionManagerData = (): TransactionManagerData => ({
  payload: {
    field: 'any_value'
  },
  signature: 'any_signature'
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

type SutTypes = {
  sut: TransactionManagerUseCase
  transactionListenerGatewayStub: TransactionListenerGateway
}

const makeSut = (): SutTypes => {
  const transactionListenerGatewayStub = makeTransactionListenerGateway()
  const sut = new TransactionManagerUseCase(transactionListenerGatewayStub)
  return {
    sut,
    transactionListenerGatewayStub
  }
}

describe('TransactionManager UseCase', () => {
  it('Should call TransactionListenerGateway with correct values', async () => {
    const { sut, transactionListenerGatewayStub } = makeSut()
    const listenerSpy = jest.spyOn(transactionListenerGatewayStub, 'listener')
    await sut.perform(makeFakeTransactionManagerData())
    expect(listenerSpy).toHaveBeenCalledWith(makeFakeTransactionManagerData())
  })
})
