import { right, type Either, left } from '@/shared/either'
import type { Validation } from '../contracts/validation'
import type { HttpRequest } from '../http-types/http'
import { LoginController } from './login-controller'
import { badRequest } from '../helpers/http/http-helpers'
import type { Auth, AuthData, AuthResponse } from '@/domain/usecases-contracts'

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

const makeAuthStub = (): Auth => {
  class AuthStub implements Auth {
    async perform (data: AuthData): Promise<AuthResponse> {
      return await Promise.resolve(right({ accessToken: 'any_token' }))
    }
  }
  return new AuthStub()
}

type SutTypes = {
  sut: LoginController
  validationCompositeStub: Validation
  authStub: Auth
}

const makeSut = (): SutTypes => {
  const validationCompositeStub = makeValidationComposite()
  const authStub = makeAuthStub()
  const sut = new LoginController(validationCompositeStub, authStub)
  return {
    sut,
    validationCompositeStub,
    authStub
  }
}

describe('Login Controller', () => {
  it('Should call ValidationComposite with correct values', async () => {
    const { sut, validationCompositeStub } = makeSut()
    const validateSpy = jest.spyOn(validationCompositeStub, 'validate')
    await sut.handle(makeFakeRequest())
    expect(validateSpy).toHaveBeenCalledWith(makeFakeRequest().body)
  })

  it('Should return 400 if ValidationComposite fails', async () => {
    const { sut, validationCompositeStub } = makeSut()
    jest.spyOn(validationCompositeStub, 'validate').mockReturnValueOnce(
      left(new Error('any_message'))
    )
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new Error('any_message')))
  })

  it('Should call Auth with correct values', async () => {
    const { sut, authStub } = makeSut()
    const performSpy = jest.spyOn(authStub, 'perform')
    await sut.handle(makeFakeRequest())
    expect(performSpy).toHaveBeenCalledWith(makeFakeRequest().body)
  })
})
