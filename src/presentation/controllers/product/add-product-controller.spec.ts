import type { ProductData } from '@/domain/entities/product'
import type { AddProduct, AddProductResponse } from '@/domain/usecases-contracts'
import type { Validation } from '@/presentation/contracts'
import { ServerError } from '@/presentation/errors'
import { badRequest, serverError } from '@/presentation/helpers/http/http-helpers'
import type { HttpRequest } from '@/presentation/http-types/http'
import { left, right, type Either } from '@/shared/either'
import { AddProductController } from './add-product-controller'

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'any name',
    description: 'any_description',
    amount: 10.90
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

const makeAddProduct = (): AddProduct => {
  class AddProductStub implements AddProduct {
    async perform (account: ProductData): Promise<AddProductResponse> {
      return await Promise.resolve(right(null))
    }
  }
  return new AddProductStub()
}

type SutTypes = {
  sut: AddProductController
  validationCompositeStub: Validation
  addProductStub: AddProduct
}

const makeSut = (): SutTypes => {
  const validationCompositeStub = makeValidationComposite()
  const addProductStub = makeAddProduct()
  const sut = new AddProductController(validationCompositeStub, addProductStub)
  return {
    sut,
    validationCompositeStub,
    addProductStub
  }
}

describe('AddProduct Controller', () => {
  it('Should call ValidationComposite with correct values', async () => {
    const { sut, validationCompositeStub } = makeSut()
    const validateSpy = jest.spyOn(validationCompositeStub, 'validate')
    await sut.handle(makeFakeRequest())
    expect(validateSpy).toHaveBeenLastCalledWith(makeFakeRequest().body)
  })

  it('Should return 400 if ValidationComposite fails', async () => {
    const { sut, validationCompositeStub } = makeSut()
    jest.spyOn(validationCompositeStub, 'validate').mockReturnValueOnce(
      left(new Error('any_message'))
    )
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new Error('any_message')))
  })

  it('Should return 500 if ValidationComposite throws', async () => {
    const { sut, validationCompositeStub } = makeSut()
    jest.spyOn(validationCompositeStub, 'validate').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    const error = new Error()
    expect(httpResponse).toEqual(serverError(new ServerError(error.stack)))
  })

  it('Should call AddProduct with correct values', async () => {
    const { sut, addProductStub } = makeSut()
    const performSpy = jest.spyOn(addProductStub, 'perform')
    await sut.handle(makeFakeRequest())
    expect(performSpy).toHaveBeenCalledWith({
      name: 'any name',
      description: 'any_description',
      amount: 10.90
    })
  })

  it('Should return 400 if AddUser fails', async () => {
    const { sut, addProductStub } = makeSut()
    jest.spyOn(addProductStub, 'perform').mockReturnValueOnce(
      Promise.resolve(left(new Error('any_message')))
    )
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new Error('any_message')))
  })
})
