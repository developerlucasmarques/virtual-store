import { User } from '@/domain/entities/user'
import { AuthUseCase } from './auth-usecase'
import { left } from '@/shared/either'
import { InvalidEmailError } from '@/domain/entities/user/errors'
import type { AuthData, AccessTokenBuilder } from '@/domain/usecases-contracts'
import { InvalidCredentialsError } from '@/domain/usecases-contracts/errors'
import type { ComparerData, HashComparer, LoadUserByEmailRepo, UpdateAccessTokenData, UpdateAccessTokenRepo } from '@/interactions/contracts'
import type { AccessTokenModel, UserModel } from '@/domain/models'

const makeFakeAuthData = (): AuthData => ({
  email: 'any_email@mail.com',
  password: 'abcd1234'
})

const makeFakeUserModel = (): UserModel => ({
  id: 'any_id',
  name: 'any name',
  email: 'any_email@mail.com',
  password: 'hashed_password',
  role: 'customer',
  accessToken: 'any_token'
})

const makeLoadUserByEmailRepo = (): LoadUserByEmailRepo => {
  class LoadUserByEmailRepoStub implements LoadUserByEmailRepo {
    async loadByEmail (email: string): Promise<null | UserModel> {
      return await Promise.resolve(makeFakeUserModel())
    }
  }
  return new LoadUserByEmailRepoStub()
}

const makeHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async comparer (data: ComparerData): Promise<boolean> {
      return await Promise.resolve(true)
    }
  }
  return new HashComparerStub()
}

const makeAccessTokenBuilder = (): AccessTokenBuilder => {
  class AccessTokenBuilderStub implements AccessTokenBuilder {
    async perform (value: string): Promise<AccessTokenModel> {
      return await Promise.resolve({ accessToken: 'any_token' })
    }
  }
  return new AccessTokenBuilderStub()
}

const makeUpdateAccessToken = (): UpdateAccessTokenRepo => {
  class UpdateAccessTokenRepoStub implements UpdateAccessTokenRepo {
    async updateAccessToken (data: UpdateAccessTokenData): Promise<void> {
      await Promise.resolve()
    }
  }
  return new UpdateAccessTokenRepoStub()
}

type SutTypes = {
  sut: AuthUseCase
  loadUserByEmailRepoStub: LoadUserByEmailRepo
  hashComparerStub: HashComparer
  accessTokenBuilderStub: AccessTokenBuilder
  updateAccessTokenRepoStub: UpdateAccessTokenRepo
}

const makeSut = (): SutTypes => {
  const loadUserByEmailRepoStub = makeLoadUserByEmailRepo()
  const hashComparerStub = makeHashComparer()
  const accessTokenBuilderStub = makeAccessTokenBuilder()
  const updateAccessTokenRepoStub = makeUpdateAccessToken()
  const sut = new AuthUseCase(
    loadUserByEmailRepoStub,
    hashComparerStub,
    accessTokenBuilderStub,
    updateAccessTokenRepoStub
  )
  return {
    sut,
    loadUserByEmailRepoStub,
    hashComparerStub,
    accessTokenBuilderStub,
    updateAccessTokenRepoStub
  }
}

describe('Auth UseCase', () => {
  it('Should call User Entity validateEmail with correct email', async () => {
    const { sut } = makeSut()
    const validateEmailSpy = jest.spyOn(User, 'validateEmail')
    await sut.perform(makeFakeAuthData())
    expect(validateEmailSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  it('Should return InvalidEmailError if User Entity validateEmail returs InvalidEmailError', async () => {
    const { sut } = makeSut()
    jest.spyOn(User, 'validateEmail').mockReturnValueOnce(
      left(new InvalidEmailError('any_email@mail.com'))
    )
    const result = await sut.perform(makeFakeAuthData())
    expect(result.value).toEqual(new InvalidEmailError('any_email@mail.com'))
  })

  it('Should call LoadUserByEmailRepo with correct email', async () => {
    const { sut, loadUserByEmailRepoStub } = makeSut()
    const loadByEmailSpy = jest.spyOn(loadUserByEmailRepoStub, 'loadByEmail')
    await sut.perform(makeFakeAuthData())
    expect(loadByEmailSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  it('Should return InvalidCredentialsError if LoadUserByEmailRepo returns null', async () => {
    const { sut, loadUserByEmailRepoStub } = makeSut()
    jest.spyOn(loadUserByEmailRepoStub, 'loadByEmail').mockReturnValueOnce(
      Promise.resolve(null)
    )
    const result = await sut.perform(makeFakeAuthData())
    expect(result.value).toEqual(new InvalidCredentialsError())
  })

  it('Should throw if LoadUserByEmailRepo throws', async () => {
    const { sut, loadUserByEmailRepoStub } = makeSut()
    jest.spyOn(loadUserByEmailRepoStub, 'loadByEmail').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const promise = sut.perform(makeFakeAuthData())
    await expect(promise).rejects.toThrow()
  })

  it('Should call HashComparer with correct values', async () => {
    const { sut, hashComparerStub } = makeSut()
    const comparerSpy = jest.spyOn(hashComparerStub, 'comparer')
    await sut.perform(makeFakeAuthData())
    expect(comparerSpy).toHaveBeenCalledWith({
      value: 'abcd1234',
      hash: 'hashed_password'
    })
  })

  it('Should return InvalidCredentialsError if HashComparer fails', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'comparer').mockReturnValueOnce(
      Promise.resolve(false)
    )
    const result = await sut.perform(makeFakeAuthData())
    expect(result.value).toEqual(new InvalidCredentialsError())
  })

  it('Should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'comparer').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const promise = sut.perform(makeFakeAuthData())
    await expect(promise).rejects.toThrow()
  })

  it('Should call AccessTokenBuilder with correct user id', async () => {
    const { sut, accessTokenBuilderStub } = makeSut()
    const performSpy = jest.spyOn(accessTokenBuilderStub, 'perform')
    await sut.perform(makeFakeAuthData())
    expect(performSpy).toHaveBeenCalledWith('any_id')
  })

  it('Should throw if AccessTokenBuilder throws', async () => {
    const { sut, accessTokenBuilderStub } = makeSut()
    jest.spyOn(accessTokenBuilderStub, 'perform').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const promise = sut.perform(makeFakeAuthData())
    await expect(promise).rejects.toThrow()
  })

  it('Should call UpdateAccessTokenRepo with correct values', async () => {
    const { sut, updateAccessTokenRepoStub } = makeSut()
    const updateAccessTokenSpy = jest.spyOn(updateAccessTokenRepoStub, 'updateAccessToken')
    await sut.perform(makeFakeAuthData())
    expect(updateAccessTokenSpy).toHaveBeenCalledWith({
      userId: 'any_id',
      accessToken: 'any_token'
    })
  })

  it('Should throw if UpdateAccessTokenRepo throws', async () => {
    const { sut, updateAccessTokenRepoStub } = makeSut()
    jest.spyOn(updateAccessTokenRepoStub, 'updateAccessToken').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const promise = sut.perform(makeFakeAuthData())
    await expect(promise).rejects.toThrow()
  })

  it('Should return access token if AccessTokenBuilder on success', async () => {
    const { sut } = makeSut()
    const result = await sut.perform(makeFakeAuthData())
    expect(result.value).toEqual({ accessToken: 'any_token' })
  })
})
