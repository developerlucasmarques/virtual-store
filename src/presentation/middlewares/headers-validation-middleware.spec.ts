import { right, type Either, left } from '@/shared/either'
import type { Validation } from '../contracts'
import type { HttpRequest } from '../http-types/http'
import { HeadersValidationMiddleware } from './headers-validation-middleware'
import { badRequest } from '../helpers/http/http-helpers'

const makeFakeRequest = (): HttpRequest => ({
  headers: { anyField: 'any_value', anotherField: 'another_value' }
})

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Either<Error, null> {
      return right(null)
    }
  }
  return new ValidationStub()
}

type SutTypes = {
  sut: HeadersValidationMiddleware
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation()
  const sut = new HeadersValidationMiddleware(validationStub)
  return {
    sut,
    validationStub
  }
}

describe('HeadersValidation Middleware', () => {
  it('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    await sut.handle(makeFakeRequest())
    expect(validateSpy).toHaveBeenCalledWith(makeFakeRequest().headers)
  })

  it('Should return 400 if Validation fails', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(
      left(new Error('any_message'))
    )
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new Error('any_message')))
  })
})
