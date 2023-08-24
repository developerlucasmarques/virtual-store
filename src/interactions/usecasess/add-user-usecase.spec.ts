import { User, type UserData, type UserModel } from '@/domain/entities/user'
import { left } from '@/shared/either'
import type { Hash, Hasher } from '../contracts/cryptography/hasher'
import type { LoadUserByEmailRepo } from '../contracts/db/load-user-by-email-repo'
import type { Id, IdBuilder } from '../contracts/id/id-builder'
import { EmailInUseError } from '../errors/email-in-use-error'
import { AddUserUseCase } from './add-user-usecase'
import type { AccessToken, AccessTokenBuilder } from '@/domain/usecases/access-token-builder'

const makeLoadUserByEmailRepo = (): LoadUserByEmailRepo => {
  class LoadUserByEmailRepoStub implements LoadUserByEmailRepo {
    async loadByEmail (email: string): Promise<null | UserModel> {
      return await Promise.resolve(null)
    }
  }
  return new LoadUserByEmailRepoStub()
}

const makeHasherStub = (): Hasher => {
  class HasherStub implements Hasher {
    async hashing (value: string): Promise<Hash> {
      return await Promise.resolve(makeFakeHash())
    }
  }
  return new HasherStub()
}

const makeIdBuilderStub = (): IdBuilder => {
  class IdBuilderStub implements IdBuilder {
    build (): Id {
      return { id: 'any_id' }
    }
  }
  return new IdBuilderStub()
}

const makeAccessTokenBuilderStub = (): AccessTokenBuilder => {
  class AccessTokenBuilderStub implements AccessTokenBuilder {
    build (value: string): AccessToken {
      return { accesToken: 'any_token' }
    }
  }
  return new AccessTokenBuilderStub()
}

const makeFakeHash = (): Hash => ({
  hash: 'hashed_password'
})

const makeFakeUserModel = (): UserModel => ({
  id: 'any_id',
  name: 'any name',
  email: 'any_email@mail.com',
  password: 'abcd1234',
  role: 'customer',
  accessToken: 'any_token'
})

const makeFakeUserData = (): UserData => ({
  name: 'any name',
  email: 'any_email@mail.com',
  password: 'abcd1234'
})

type SutTypes = {
  sut: AddUserUseCase
  loadUserByEmailRepoStub: LoadUserByEmailRepo
  hasherStub: Hasher
  idBuilderStub: IdBuilder
  accessTokenBuilderStub: AccessTokenBuilder
}

const makeSut = (): SutTypes => {
  const loadUserByEmailRepoStub = makeLoadUserByEmailRepo()
  const hasherStub = makeHasherStub()
  const idBuilderStub = makeIdBuilderStub()
  const accessTokenBuilderStub = makeAccessTokenBuilderStub()
  const sut = new AddUserUseCase(loadUserByEmailRepoStub, hasherStub, idBuilderStub, accessTokenBuilderStub)
  return {
    sut,
    loadUserByEmailRepoStub,
    hasherStub,
    idBuilderStub,
    accessTokenBuilderStub
  }
}

describe('AddUser UseCase', () => {
  it('Should call User Entity with correct values', async () => {
    const { sut } = makeSut()
    const createSpy = jest.spyOn(User, 'create')
    await sut.perform(makeFakeUserData())
    expect(createSpy).toHaveBeenCalledWith(makeFakeUserData())
  })

  it('Should return a Error if create User fails', async () => {
    const { sut } = makeSut()
    jest.spyOn(User, 'create').mockReturnValueOnce(
      left(new Error('any message'))
    )
    const result = await sut.perform(makeFakeUserData())
    expect(result.value).toEqual(new Error('any message'))
  })

  it('Should call LoadUserByEmailRepo with correct email', async () => {
    const { sut, loadUserByEmailRepoStub } = makeSut()
    const loadByEmailSpy = jest.spyOn(loadUserByEmailRepoStub, 'loadByEmail')
    await sut.perform(makeFakeUserData())
    expect(loadByEmailSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  it('Should return EmailInUseError if LoadUserByEmailRepo return a UserModel', async () => {
    const { sut, loadUserByEmailRepoStub } = makeSut()
    jest.spyOn(loadUserByEmailRepoStub, 'loadByEmail').mockReturnValueOnce(
      Promise.resolve(makeFakeUserModel())
    )
    const result = await sut.perform(makeFakeUserData())
    expect(result.value).toEqual(new EmailInUseError('any_email@mail.com'))
  })

  it('Should throw if LoadUserByEmailRepo throws', async () => {
    const { sut, loadUserByEmailRepoStub } = makeSut()
    jest.spyOn(loadUserByEmailRepoStub, 'loadByEmail').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const promise = sut.perform(makeFakeUserData())
    await expect(promise).rejects.toThrow()
  })

  it('Should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut()
    const hashingSpy = jest.spyOn(hasherStub, 'hashing')
    await sut.perform(makeFakeUserData())
    expect(hashingSpy).toHaveBeenCalledWith('abcd1234')
  })

  it('Should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hashing').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const promise = sut.perform(makeFakeUserData())
    await expect(promise).rejects.toThrow()
  })

  it('Should call IdBuilder', async () => {
    const { sut, idBuilderStub } = makeSut()
    const buildSpy = jest.spyOn(idBuilderStub, 'build')
    await sut.perform(makeFakeUserData())
    expect(buildSpy).toHaveBeenCalled()
  })

  it('Should throw if IdBuilder throws', async () => {
    const { sut, idBuilderStub } = makeSut()
    jest.spyOn(idBuilderStub, 'build').mockImplementation(() => {
      throw new Error()
    }
    )
    const promise = sut.perform(makeFakeUserData())
    await expect(promise).rejects.toThrow()
  })

  it('Should call AccessTokenBuilder with correct Id', async () => {
    const { sut, accessTokenBuilderStub } = makeSut()
    const buildSpy = jest.spyOn(accessTokenBuilderStub, 'build')
    await sut.perform(makeFakeUserData())
    expect(buildSpy).toHaveBeenCalledWith('any_id')
  })

  it('Should throw if AccessTokenBuilder throws', async () => {
    const { sut, accessTokenBuilderStub } = makeSut()
    jest.spyOn(accessTokenBuilderStub, 'build').mockImplementation(() => {
      throw new Error()
    }
    )
    const promise = sut.perform(makeFakeUserData())
    await expect(promise).rejects.toThrow()
  })
})
