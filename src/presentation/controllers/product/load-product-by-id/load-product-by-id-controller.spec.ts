import type { Validation } from '@/presentation/contracts'
import type { HttpRequest } from '@/presentation/http-types/http'
import { type Either, right, left } from '@/shared/either'
import { LoadProductByIdController } from './load-product-by-id-controller'
import { badRequest, notFound, ok, serverError } from '@/presentation/helpers/http/http-helpers'
import type { LoadProductById, LoadProductByIdResponse } from '@/domain/usecases-contracts'
import type { ProductModel } from '@/domain/models'
import { ProductNotFoundError } from '@/domain/usecases-contracts/export-errors'
import { ServerError } from '@/presentation/errors'

const makeFakeRequest = (): HttpRequest => ({
  params: {
    productId: 'any_id'
  }
})

const makeFakeProductModel = (): ProductModel => ({
  id: 'any_id',
  name: 'any name',
  amount: 10.90,
  description: 'any description'
})

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Either<Error, null> {
      return right(null)
    }
  }
  return new ValidationStub()
}

const makeLoadProductById = (): LoadProductById => {
  class LoadProductByIdStub implements LoadProductById {
    async perform (productId: string): Promise<LoadProductByIdResponse> {
      return await Promise.resolve(right(makeFakeProductModel()))
    }
  }
  return new LoadProductByIdStub()
}

type SutTypes = {
  sut: LoadProductByIdController
  validationStub: Validation
  loadProductByIdStub: LoadProductById
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation()
  const loadProductByIdStub = makeLoadProductById()
  const sut = new LoadProductByIdController(validationStub, loadProductByIdStub)
  return {
    sut,
    validationStub,
    loadProductByIdStub
  }
}

describe('LoadProductById Controller', () => {
  it('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    await sut.handle(makeFakeRequest())
    expect(validateSpy).toHaveBeenLastCalledWith(makeFakeRequest().params)
  })

  it('Should return 400 if Validation fails', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(
      left(new Error('any_message'))
    )
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new Error('any_message')))
  })

  it('Should return 500 if Validation throws', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    const error = new Error()
    expect(httpResponse).toEqual(serverError(new ServerError(error.stack)))
  })

  it('Should call LoadProductById with correct id', async () => {
    const { sut, loadProductByIdStub } = makeSut()
    const performSpy = jest.spyOn(loadProductByIdStub, 'perform')
    await sut.handle(makeFakeRequest())
    expect(performSpy).toHaveBeenCalledWith('any_id')
  })

  it('Should return 404 if LoadProductById returns ProductNotFoundError', async () => {
    const { sut, loadProductByIdStub } = makeSut()
    jest.spyOn(loadProductByIdStub, 'perform').mockReturnValueOnce(
      Promise.resolve(left(new ProductNotFoundError('any_id')))
    )
    const result = await sut.handle(makeFakeRequest())
    expect(result).toEqual(notFound(new ProductNotFoundError('any_id')))
  })

  it('Should return 500 if LoadProductById throws', async () => {
    const { sut, loadProductByIdStub } = makeSut()
    jest.spyOn(loadProductByIdStub, 'perform').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    const error = new Error()
    expect(httpResponse).toEqual(serverError(new ServerError(error.stack)))
  })

  it('Should return 200 if LoadProductById is a success', async () => {
    const { sut } = makeSut()
    const result = await sut.handle(makeFakeRequest())
    expect(result).toEqual(ok(makeFakeProductModel()))
  })
})
