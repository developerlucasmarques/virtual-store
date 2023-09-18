import type { UserModel } from '@/domain/models'
import { type AccessControlData } from '@/domain/usecases-contracts'
import type { Decrypter, LoadUserByIdRepo } from '@/interactions/contracts'
import { AccessControlUseCase } from './access-control-usecase'
import { AccessDeniedError, InvalidTokenError } from '@/domain/usecases-contracts/errors'

const makeFakeAccessControlData = (): AccessControlData => ({
  accessToken: 'any_token',
  role: 'admin'
})

const makeFakeUserModel = (): UserModel => ({
  id: 'any_id',
  name: 'any name',
  email: 'any_email@mail.com',
  password: 'hashed_password',
  role: 'admin',
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
    expect(decryptSpy).toHaveBeenCalledWith('any_token')
  })

  test('Should return InvalidTokenError if Decrypter return null', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(Promise.resolve(null))
    const result = await sut.perform(makeFakeAccessControlData())
    expect(result.value).toEqual(new InvalidTokenError())
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
    expect(loadByIdSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should return AccessDeniedError if LoadUsertById return null', async () => {
    const { sut, loadUserByIdRepoStub } = makeSut()
    jest.spyOn(loadUserByIdRepoStub, 'loadById').mockReturnValueOnce(Promise.resolve(null))
    const result = await sut.perform(makeFakeAccessControlData())
    expect(result.value).toEqual(new AccessDeniedError())
  })

  it('Should throw if LoadUsertById throws', async () => {
    const { sut, loadUserByIdRepoStub } = makeSut()
    jest.spyOn(loadUserByIdRepoStub, 'loadById').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const promise = sut.perform(makeFakeAccessControlData())
    await expect(promise).rejects.toThrow()
  })

  test('Should return AccessDeniedError if the user role is different from the required role', async () => {
    const { sut, loadUserByIdRepoStub } = makeSut()
    jest.spyOn(loadUserByIdRepoStub, 'loadById').mockReturnValueOnce(
      Promise.resolve({
        id: 'any_id',
        name: 'any name',
        email: 'any_email@mail.com',
        password: 'hashed_password',
        role: 'customer',
        accessToken: 'any_token'
      })
    )
    const result = await sut.perform(makeFakeAccessControlData())
    expect(result.value).toEqual(new AccessDeniedError())
  })

  test('Should return an userId if the user role is admin', async () => {
    const { sut, loadUserByIdRepoStub } = makeSut()
    jest.spyOn(loadUserByIdRepoStub, 'loadById').mockReturnValueOnce(
      Promise.resolve(makeFakeUserModel())
    )
    const result = await sut.perform({
      accessToken: 'any_token',
      role: 'customer'
    })
    expect(result.value).toEqual({ userId: 'any_id' })
  })

  test('Should return an userId if validations on success', async () => {
    const { sut } = makeSut()
    const result = await sut.perform(makeFakeAccessControlData())
    expect(result.value).toEqual({ userId: 'any_id' })
  })
})
