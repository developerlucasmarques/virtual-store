import { User } from '@/domain/entities/user'
import { AuthUseCase } from './auth-usecase'
import { left } from '@/shared/either'
import { InvalidEmailError } from '@/domain/entities/user/errors'
import { InvalidCredentialsError, type AuthData } from '@/domain/usecases-contracts'
import type { LoadUserByEmailRepo } from '@/interactions/contracts'
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

type SutTypes = {
  sut: AuthUseCase
  loadUserByEmailRepoStub: LoadUserByEmailRepo
}

const makeFakeSut = (): SutTypes => {
  const loadUserByEmailRepoStub = makeLoadUserByEmailRepo()
  const sut = new AuthUseCase(loadUserByEmailRepoStub)
  return {
    sut,
    loadUserByEmailRepoStub
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
})
