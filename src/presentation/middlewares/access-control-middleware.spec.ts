import type { AccessControl, AccessControlData, AccessControlResponse } from '@/domain/usecases-contracts'
import { AccessTokenNotInformedError, ServerError } from '../errors'
import { forbidden, serverError, unauthorized } from '../helpers/http/http-helpers'
import { AccessControlMiddleware } from './access-control-middleware'
import { left, right } from '@/shared/either'
import type { HttpRequest } from '../http-types/http'
import { AccessDeniedError, InvalidTokenError } from '@/domain/usecases-contracts/export-errors'

const makeFakeRequest = (): HttpRequest => ({
  headers: { 'x-access-token': 'any_token' }
})

const makeFakeAccessControlData = (): AccessControlData => ({
  accessToken: 'any_token',
  role: 'admin'
})

const makeAccessControlStub = (): AccessControl => {
  class AccessControlStub implements AccessControl {
    async perform (data: AccessControlData): Promise<AccessControlResponse> {
      return await Promise.resolve(right({ userId: 'any_id' }))
    }
  }
  return new AccessControlStub()
}

type SutTypes = {
  sut: AccessControlMiddleware
  accessControlStub: AccessControl
}

const makeSut = (): SutTypes => {
  const accessControlStub = makeAccessControlStub()
  const sut = new AccessControlMiddleware(accessControlStub, 'admin')
  return {
    sut,
    accessControlStub
  }
}

describe('AccessControl Middleware', () => {
  it('Should return 401 if x-access-token not provided in headers', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(unauthorized(new AccessTokenNotInformedError()))
  })

  it('Should call AccessControl with correct values', async () => {
    const { sut, accessControlStub } = makeSut()
    const performSpy = jest.spyOn(accessControlStub, 'perform')
    await sut.handle(makeFakeRequest())
    expect(performSpy).toHaveBeenCalledWith(makeFakeAccessControlData())
  })

  it('Should return 401 if AccessControl return InvalidTokenError', async () => {
    const { sut, accessControlStub } = makeSut()
    jest.spyOn(accessControlStub, 'perform').mockReturnValueOnce(
      Promise.resolve(left(new InvalidTokenError()))
    )
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(unauthorized(new InvalidTokenError()))
  })

  it('Should return 403 if AccessControl return AccessDeniedError', async () => {
    const { sut, accessControlStub } = makeSut()
    jest.spyOn(accessControlStub, 'perform').mockReturnValueOnce(
      Promise.resolve(left(new AccessDeniedError()))
    )
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  it('Should return 500 if AccessControl throws', async () => {
    const { sut, accessControlStub } = makeSut()
    jest.spyOn(accessControlStub, 'perform').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    const error = new Error()
    expect(httpResponse).toEqual(serverError(new ServerError(error.stack)))
  })
})
