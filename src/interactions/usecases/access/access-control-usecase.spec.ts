import type { AccessControlData } from '@/domain/usecases-contracts'
import type { Decrypter, LoadUserByIdRepo } from '@/interactions/contracts'
import { AccessControlUseCase } from './access-control-usecase'
import { left } from '@/shared/either'
import { InvalidTokenError } from '@/domain/usecases-contracts/export-errors'
import type { UserModel } from '@/domain/models'

const makeFakeAccessControlData = (): AccessControlData => ({
  accessToken: 'any_token',
  role: 'admin'
})

const makeFakeUserModel = (): UserModel => ({
  id: 'any_id',
  name: 'any name',
  email: 'any_email@mail.com',
  password: 'hashed_password',
  role: 'customer',
  accessToken: 'any_token'
})

const makeDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (token: string): Promise<null | string> {
      return await Promise.resolve('any_id')
    }
  }
  return new DecrypterStub()
}

const makeLoadUserByIdRepo = (): LoadUserByIdRepo => {
  class LoadUserByIdRepoStub implements LoadUserByIdRepo {
    async loadById (id: string): Promise<null | UserModel> {
      return await Promise.resolve(makeFakeUserModel())
    }
  }
  return new LoadUserByIdRepoStub()
}

type SutTypes = {
  sut: AccessControlUseCase
  decrypterStub: Decrypter
  loadUserByIdRepoStub: LoadUserByIdRepo
}

const makeSut = (): SutTypes => {
  const decrypterStub = makeDecrypter()
  const loadUserByIdRepoStub = makeLoadUserByIdRepo()
  const sut = new AccessControlUseCase(decrypterStub, loadUserByIdRepoStub)
  return {
    sut,
    decrypterStub,
    loadUserByIdRepoStub
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

  test('Should call LoadUsertById with correct value', async () => {
    const { sut, loadUserByIdRepoStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadUserByIdRepoStub, 'loadById')
    await sut.perform(makeFakeAccessControlData())
    expect(loadByIdSpy).toBeCalledWith('any_id')
  })
})
