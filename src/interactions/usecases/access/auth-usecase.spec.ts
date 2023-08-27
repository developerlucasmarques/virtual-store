import { User } from '@/domain/entities/user'
import { AuthUseCase } from './auth-usecase'
import { left } from '@/shared/either'
import { InvalidEmailError } from '@/domain/entities/user/errors'
import { InvalidCredentialsError, type AuthData } from '@/domain/usecases-contracts'
import type { ComparerData, HashComparer, LoadUserByEmailRepo } from '@/interactions/contracts'
import type { UserModel } from '@/domain/models'

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

type SutTypes = {
  sut: AuthUseCase
  loadUserByEmailRepoStub: LoadUserByEmailRepo
  hashComparerStub: HashComparer
}

const makeFakeSut = (): SutTypes => {
  const loadUserByEmailRepoStub = makeLoadUserByEmailRepo()
  const hashComparerStub = makeHashComparer()
  const sut = new AuthUseCase(loadUserByEmailRepoStub, hashComparerStub)
  return {
    sut,
    loadUserByEmailRepoStub,
    hashComparerStub
  }
}

describe('Auth UseCase', () => {
  it('Should call User Entity validateEmail with correct email', async () => {
    const { sut } = makeFakeSut()
    const validateEmailSpy = jest.spyOn(User, 'validateEmail')
    await sut.perform(makeFakeAuthData())
    expect(validateEmailSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  it('Should return InvalidEmailError if User Entity validateEmail returs InvalidEmailError', async () => {
    const { sut } = makeFakeSut()
    jest.spyOn(User, 'validateEmail').mockReturnValueOnce(
      left(new InvalidEmailError('any_email@mail.com'))
    )
    const result = await sut.perform(makeFakeAuthData())
    expect(result.value).toEqual(new InvalidEmailError('any_email@mail.com'))
  })

  it('Should call LoadUserByEmailRepo with correct email', async () => {
    const { sut, loadUserByEmailRepoStub } = makeFakeSut()
    const loadByEmailSpy = jest.spyOn(loadUserByEmailRepoStub, 'loadByEmail')
    await sut.perform(makeFakeAuthData())
    expect(loadByEmailSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  it('Should return InvalidCredentialsError if LoadUserByEmailRepo returns null', async () => {
    const { sut, loadUserByEmailRepoStub } = makeFakeSut()
    jest.spyOn(loadUserByEmailRepoStub, 'loadByEmail').mockReturnValueOnce(
      Promise.resolve(null)
    )
    const result = await sut.perform(makeFakeAuthData())
    expect(result.value).toEqual(new InvalidCredentialsError())
  })

  it('Should call HashComparer with correct values', async () => {
    const { sut, hashComparerStub } = makeFakeSut()
    const comparerSpy = jest.spyOn(hashComparerStub, 'comparer')
    await sut.perform(makeFakeAuthData())
    expect(comparerSpy).toHaveBeenCalledWith({
      value: 'abcd1234',
      hash: 'hashed_password'
    })
  })
})
