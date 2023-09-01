import { right, type Either, left } from '@/shared/either'
import type { Validation } from '@/presentation/contracts/validation'
import type { HttpRequest } from '@/presentation/http-types/http'
import { LoginController } from './login-controller'
import { badRequest, ok, serverError, unauthorized } from '@/presentation/helpers/http/http-helpers'
import type { Auth, AuthData, AuthResponse } from '@/domain/usecases-contracts'
import { InvalidEmailError } from '@/domain/entities/user/errors'
import { InvalidCredentialsError } from '@/domain/usecases-contracts/errors'

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

const makeAuth = (): Auth => {
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
  const authStub = makeAuth()
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

  it('Should return 400 if Auth returns InvalidEmailError', async () => {
    const { sut, authStub } = makeSut()
    jest.spyOn(authStub, 'perform').mockReturnValueOnce(
      Promise.resolve(left(new InvalidEmailError('any_email@mail.com')))
    )
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new InvalidEmailError('any_email@mail.com')))
  })

  it('Should return 401 if Auth returns InvalidCredentialsError', async () => {
    const { sut, authStub } = makeSut()
    jest.spyOn(authStub, 'perform').mockReturnValueOnce(
      Promise.resolve(left(new InvalidCredentialsError()))
    )
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(unauthorized(new InvalidCredentialsError()))
  })

  it('Should return 500 if Auth throws', async () => {
    const { sut, authStub } = makeSut()
    jest.spyOn(authStub, 'perform').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return access token if Auth on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }))
  })
})
