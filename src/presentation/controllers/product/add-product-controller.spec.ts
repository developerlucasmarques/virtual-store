import type { Validation } from '@/presentation/contracts'
import type { HttpRequest } from '@/presentation/http-types/http'
import { type Either, right } from '@/shared/either'
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

type SutTypes = {
  sut: AddProductController
  validationCompositeStub: Validation
}

const makeSut = (): SutTypes => {
  const validationCompositeStub = makeValidationComposite()
  const sut = new AddProductController(validationCompositeStub)
  return {
    sut,
    validationCompositeStub
  }
}

describe('AddProduct Controller', () => {
  it('Should call ValidationComposite with correct values', async () => {
    const { sut, validationCompositeStub } = makeSut()
    const validateSpy = jest.spyOn(validationCompositeStub, 'validate')
    await sut.handle(makeFakeRequest())
    expect(validateSpy).toHaveBeenLastCalledWith(makeFakeRequest().body)
  })
})
