import { right, type Either } from '@/shared/either'
import type { Validation } from '../contracts/validation'
import type { HttpRequest } from '../http-types/http'
import { LoginController } from './login-controller'

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@mail.com',
    password: 'abcd1234'
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

interface SutTypes {
  sut: LoginController
  validationCompositeStub: Validation
}

const makeSut = (): SutTypes => {
  const validationCompositeStub = makeValidationComposite()
  const sut = new LoginController(validationCompositeStub)
  return {
    sut,
    validationCompositeStub
  }
}

describe('Login Controller', () => {
  it('Should call ValidationComposite with correct values', async () => {
    const { sut, validationCompositeStub } = makeSut()
    const validateSpy = jest.spyOn(validationCompositeStub, 'validate')
    await sut.handle(makeFakeRequest())
    expect(validateSpy).toHaveBeenCalledWith(makeFakeRequest().body)
  })
})
