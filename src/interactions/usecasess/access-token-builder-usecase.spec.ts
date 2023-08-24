import type { Token, Ecrypter, EncrypterData } from '../contracts'
import { AccessTokenBuilderUseCase } from './access-token-builder-usecase'

const makeAccessTokenEncrypterStub = (): Ecrypter => {
  class AccessTokenEcrypterStub implements Ecrypter {
    async encrypt (data: EncrypterData): Promise<Token> {
      return { token: 'any_token' }
    }
  }
  return new AccessTokenEcrypterStub()
}

const makeFakeEncrypterData = (): EncrypterData => ({
  value: 'any_value',
  expiresInHours: 24
})

type SutTypes = {
  sut: AccessTokenBuilderUseCase
  encrypterStub: Ecrypter
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeAccessTokenEncrypterStub()
  const sut = new AccessTokenBuilderUseCase(encrypterStub)
  return {
    sut,
    encrypterStub
  }
}

describe('AccessTokenBuilder UseCase', () => {
  it('Should call Ecrypter with correct values', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    await sut.perform('any_value')
    expect(encryptSpy).toHaveBeenCalledWith(makeFakeEncrypterData())
  })
})
