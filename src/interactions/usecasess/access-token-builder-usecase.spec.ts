import type { AccessToken, AccessTokenEcrypter, AccessTokenEcrypterData } from '../contracts'
import { AccessTokenBuilderUseCase } from './access-toekn-builder-usecase'

const makeAccessTokenEncrypterStub = (): AccessTokenEcrypter => {
  class AccessTokenEcrypterStub implements AccessTokenEcrypter {
    encryptAccessToken (data: AccessTokenEcrypterData): AccessToken {
      return { accessToken: 'any_token' }
    }
  }
  return new AccessTokenEcrypterStub()
}

const makeFakeAccessTokenEncrypterData = (): AccessTokenEcrypterData => ({
  value: 'any_value',
  expiresInHours: 24
})

type SutTypes = {
  sut: AccessTokenBuilderUseCase
  accessTokenEncrypterStub: AccessTokenEcrypter
}

const makeSut = (): SutTypes => {
  const accessTokenEncrypterStub = makeAccessTokenEncrypterStub()
  const sut = new AccessTokenBuilderUseCase(accessTokenEncrypterStub)
  return {
    sut,
    accessTokenEncrypterStub
  }
}

describe('AccessTokenBuilder UseCase', () => {
  it('Should call AccessTokenEcrypter with correct values', async () => {
    const { sut, accessTokenEncrypterStub } = makeSut()
    const buildSpy = jest.spyOn(accessTokenEncrypterStub, 'encryptAccessToken')
    sut.build('any_value')
    expect(buildSpy).toHaveBeenCalledWith(makeFakeAccessTokenEncrypterData())
  })
})
