import { type TransactionManager, type TransactionManagerData, type TransactionManagerResponse } from '@/domain/usecases-contracts'
import { PayloadNotInformedError, SignatureNotInformedError } from '@/presentation/errors'
import { badRequest, noContent, serverError } from '@/presentation/helpers/http/http-helpers'
import type { HttpRequest } from '@/presentation/http-types/http'
import { left, right } from '@/shared/either'
import { TransactionManagerController } from './transaction-manager-controller'

const makeFakeRequest = (): HttpRequest => ({
  headers: {
    signature: 'any_signature'
  },
  body: {
    payload: 'any_payload'
  }
})

const makeTransactionManager = (): TransactionManager => {
  class TransactionManagerStub implements TransactionManager {
    async perform (data: TransactionManagerData): Promise<TransactionManagerResponse> {
      return await Promise.resolve(right(null))
    }
  }
  return new TransactionManagerStub()
}

type SutTypes = {
  sut: TransactionManagerController
  transactionManagerStub: TransactionManager
}

const makeSut = (): SutTypes => {
  const transactionManagerStub = makeTransactionManager()
  const sut = new TransactionManagerController(transactionManagerStub)
  return {
    sut,
    transactionManagerStub
  }
}

describe('TransactionManager Controller', () => {
  it('Should return 400 if signature is not informed in headers', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(badRequest(new SignatureNotInformedError()))
  })

  it('Should return 400 if payload is not informed in body', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({
      headers: { signature: 'any_signature' }
    })
    expect(httpResponse).toEqual(badRequest(new PayloadNotInformedError()))
  })

  it('Should call TransactionManager with correct values', async () => {
    const { sut, transactionManagerStub } = makeSut()
    const performSpy = jest.spyOn(transactionManagerStub, 'perform')
    await sut.handle(makeFakeRequest())
    expect(performSpy).toHaveBeenCalledWith({
      signature: 'any_signature',
      payload: 'any_payload'
    })
  })

  it('Should return 500 if TransactionManager returns an error', async () => {
    const { sut, transactionManagerStub } = makeSut()
    jest.spyOn(transactionManagerStub, 'perform').mockReturnValueOnce(
      Promise.resolve(left(new Error('any_message')))
    )
    const httpResonse = await sut.handle(makeFakeRequest())
    expect(httpResonse).toEqual(serverError(new Error('any_message')))
  })

  it('Should return 500 if TransactionManager throws', async () => {
    const { sut, transactionManagerStub } = makeSut()
    jest.spyOn(transactionManagerStub, 'perform').mockReturnValueOnce(
      Promise.reject(new Error('any_message'))
    )
    const httpResonse = await sut.handle(makeFakeRequest())
    expect(httpResonse).toEqual(serverError(new Error('any_message')))
  })

  it('Should return 204 if TransactionManager is a success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(noContent())
  })
})
