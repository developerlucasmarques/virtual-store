import type { Validation } from '@/presentation/contracts'
import type { HttpRequest } from '@/presentation/http-types/http'
import { type Either, right } from '@/shared/either'
import { AddProductToCartController } from './add-product-to-cart-controller'

const makeFakeRequest = (): HttpRequest => ({
  body: {
    productId: 'any_product_id',
    productQty: 2
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

type SutTypes = {
  sut: AddProductToCartController
  validationCompositeStub: Validation
}

const makeSut = (): SutTypes => {
  const validationCompositeStub = makeValidationComposite()
  const sut = new AddProductToCartController(validationCompositeStub)
  return {
    sut,
    validationCompositeStub
  }
}

describe('AddProductToCart Controller', () => {
  it('Should call ValidationComposite with correct values', async () => {
    const { sut, validationCompositeStub } = makeSut()
    const validateSpy = jest.spyOn(validationCompositeStub, 'validate')
    await sut.handle(makeFakeRequest())
    expect(validateSpy).toHaveBeenLastCalledWith(makeFakeRequest().body)
  })
})
