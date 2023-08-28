import type { AccessControlData } from '@/domain/usecases-contracts'
import type { Decrypter, DecrypterResponse } from '@/interactions/contracts'
import { AccessControlUseCase } from './access-control-usecase'

const makeFakeAccessControlData = (): AccessControlData => ({
  accessToken: 'any_token',
  role: 'admin'
})

const makeDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (token: string): Promise<DecrypterResponse> {
      return await Promise.resolve({ id: 'any_id' })
    }
  }
  return new DecrypterStub()
}

type SutTypes = {
  sut: AccessControlUseCase
  decrypterStub: Decrypter
}

const makeSut = (): SutTypes => {
  const decrypterStub = makeDecrypter()
  const sut = new AccessControlUseCase(decrypterStub)
  return {
    sut,
    decrypterStub
  }
}

describe('AccessControl UseCase', () => {
  test('Should call Decrypter with correct values', async () => {
    const { sut, decrypterStub } = makeSut()
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')
    await sut.perform(makeFakeAccessControlData())
    expect(decryptSpy).toBeCalledWith('any_token')
  })
})
