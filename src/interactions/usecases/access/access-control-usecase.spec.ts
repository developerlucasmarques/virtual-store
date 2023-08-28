import type { AccessControlData } from '@/domain/usecases-contracts'
import type { Decrypter } from '@/interactions/contracts'
import { AccessControlUseCase } from './access-control-usecase'
import { left } from '@/shared/either'
import { InvalidTokenError } from '@/domain/usecases-contracts/export-errors'

const makeFakeAccessControlData = (): AccessControlData => ({
  accessToken: 'any_token',
  role: 'admin'
})

const makeDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (token: string): Promise<null | string> {
      return await Promise.resolve('any_id')
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

  test('Should return InvalidTokenError if Decrypter return null', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(Promise.resolve(null))
    const loadResult = await sut.perform(makeFakeAccessControlData())
    expect(loadResult).toEqual(left(new InvalidTokenError()))
  })

  it('Should throw if Decrypter throws', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const promise = sut.perform(makeFakeAccessControlData())
    await expect(promise).rejects.toThrow()
  })
})
