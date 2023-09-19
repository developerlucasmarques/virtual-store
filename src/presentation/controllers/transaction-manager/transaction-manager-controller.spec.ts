import type { TransactionManager, TransactionManagerData, TransactionManagerResponse } from '@/domain/usecases-contracts'
import type { Validation } from '@/presentation/contracts'
import { badRequest, noContent, serverError } from '@/presentation/helpers/http/http-helpers'
import type { HttpRequest } from '@/presentation/http-types/http'
import { left, right, type Either } from '@/shared/either'
import { TransactionManagerController } from './transaction-manager-controller'

const makeFakeRequest = (): HttpRequest => ({
  headers: {
    signature: 'any_signature'
  },
  body: {
    payload: 'any_payload'
  }
})

const makeValidationComposite = (): Validation => {
  class ValidationCompositeStub implements Validation {
    validate (input: any): Either<Error, null> {
      return right(null)
    }
  }
  return new ValidationCompositeStub()
}

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
  validationCompositeStub: Validation
  transactionManagerStub: TransactionManager
}

const makeSut = (): SutTypes => {
  const validationCompositeStub = makeValidationComposite()
  const transactionManagerStub = makeTransactionManager()
  const sut = new TransactionManagerController(validationCompositeStub, transactionManagerStub)
  return {
    sut,
    validationCompositeStub,
    transactionManagerStub
  }
}

describe('TransactionManager Controller', () => {
  it('Should call ValidationComposite with correct headers', async () => {
    const { sut, validationCompositeStub } = makeSut()
    const validateSpy = jest.spyOn(validationCompositeStub, 'validate')
    await sut.handle(makeFakeRequest())
    expect(validateSpy).toHaveBeenCalledWith({ signature: 'any_signature' })
  })

  it('Should call ValidationComposite with correct body', async () => {
    const { sut, validationCompositeStub } = makeSut()
    const validateSpy = jest.spyOn(validationCompositeStub, 'validate')
    await sut.handle(makeFakeRequest())
    expect(validateSpy).toHaveBeenCalledWith({ payload: 'any_payload' })
  })

  it('Should call ValidationComposite twice', async () => {
    const { sut, validationCompositeStub } = makeSut()
    const validateSpy = jest.spyOn(validationCompositeStub, 'validate')
    await sut.handle(makeFakeRequest())
    expect(validateSpy).toHaveBeenCalledTimes(2)
  })

  it('Should return 400 if ValidationComposite returns an error', async () => {
    const { sut, validationCompositeStub } = makeSut()
    jest.spyOn(validationCompositeStub, 'validate').mockReturnValueOnce(
      left(new Error('any_message'))
    )
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(badRequest(new Error('any_message')))
  })

  it('Should return 400 with the first error that ValidationComposite returns', async () => {
    const { sut, validationCompositeStub } = makeSut()
    jest.spyOn(validationCompositeStub, 'validate').mockReturnValueOnce(
      left(new Error('any_message'))
    )
    jest.spyOn(validationCompositeStub, 'validate').mockReturnValueOnce(
      left(new Error('another_message'))
    )
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(badRequest(new Error('any_message')))
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
