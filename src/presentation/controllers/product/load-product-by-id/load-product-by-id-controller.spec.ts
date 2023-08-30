import type { Validation } from '@/presentation/contracts'
import type { HttpRequest } from '@/presentation/http-types/http'
import { type Either, right } from '@/shared/either'
import { LoadProductByIdController } from './load-product-by-id-controller'

const makeFakeRequest = (): HttpRequest => ({
  params: {
    productId: 'any_id'
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
  sut: LoadProductByIdController
  validationCompositeStub: Validation
}

const makeSut = (): SutTypes => {
  const validationCompositeStub = makeValidationComposite()
  const sut = new LoadProductByIdController(validationCompositeStub)
  return {
    sut,
    validationCompositeStub
  }
}

describe('LoadProductById Controller', () => {
  it('Should call ValidationComposite with correct values', async () => {
    const { sut, validationCompositeStub } = makeSut()
    const validateSpy = jest.spyOn(validationCompositeStub, 'validate')
    await sut.handle(makeFakeRequest())
    expect(validateSpy).toHaveBeenLastCalledWith('any_id')
  })
})
