import type { Validation } from '@/presentation/contracts'
import type { HttpRequest } from '@/presentation/http-types/http'
import { type Either, right, left } from '@/shared/either'
import { AddProductToCartController } from './add-product-to-cart-controller'
import { badRequest, noContent, serverError } from '@/presentation/helpers/http/http-helpers'
import { ServerError } from '@/presentation/errors'
import type { AddProductToCart, AddProductToCartData, AddProductToCartResponse } from '@/domain/usecases-contracts'

const makeFakeRequest = (): HttpRequest => ({
  body: {
    productId: 'any_product_id',
    productQty: 2
  },
  headers: {
    userId: 'any_user_id'
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

const makeAddProductToCart = (): AddProductToCart => {
  class AddProductToCartStub implements AddProductToCart {
    async perform (data: AddProductToCartData): Promise<AddProductToCartResponse> {
      return await Promise.resolve(right(null))
    }
  }
  return new AddProductToCartStub()
}

type SutTypes = {
  sut: AddProductToCartController
  validationCompositeStub: Validation
  addProductToCartStub: AddProductToCart
}

const makeSut = (): SutTypes => {
  const validationCompositeStub = makeValidationComposite()
  const addProductToCartStub = makeAddProductToCart()
  const sut = new AddProductToCartController(validationCompositeStub, addProductToCartStub)
  return {
    sut,
    validationCompositeStub,
    addProductToCartStub
  }
}

describe('AddProductToCart Controller', () => {
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

  it('Should call AddProductToCart with correct values', async () => {
    const { sut, addProductToCartStub } = makeSut()
    const performSpy = jest.spyOn(addProductToCartStub, 'perform')
    await sut.handle(makeFakeRequest())
    expect(performSpy).toHaveBeenLastCalledWith({
      userId: 'any_user_id',
      productId: 'any_product_id',
      productQty: 2
    })
  })

  it('Should return 400 if AddProductToCart fails', async () => {
    const { sut, addProductToCartStub } = makeSut()
    jest.spyOn(addProductToCartStub, 'perform').mockReturnValueOnce(
      Promise.resolve(left(new Error('any_message')))
    )
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new Error('any_message')))
  })

  it('Should return 500 if AddProductToCart throws', async () => {
    const { sut, addProductToCartStub } = makeSut()
    jest.spyOn(addProductToCartStub, 'perform').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    const error = new Error()
    expect(httpResponse).toEqual(serverError(new ServerError(error.stack)))
  })

  it('Should return 204 if AddProductToCart is a success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(noContent())
  })
})
