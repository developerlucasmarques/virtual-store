import { User, type UserModel, type UserData } from '@/domain/entities/user'
import { left } from '@/shared/either'
import { AddUserUseCase } from './add-user-usecase'
import type { LoadUserByEmailRepo } from '../contracts/db/load-user-by-email-repo'
import { EmailInUseError } from '../errors/email-in-use-error'

const makeLoadUserByEmailRepo = (): LoadUserByEmailRepo => {
  class LoadUserByEmailRepoStub implements LoadUserByEmailRepo {
    async loadByEmail (email: string): Promise<null | UserModel> {
      return await Promise.resolve(null)
    }
  }
  return new LoadUserByEmailRepoStub()
}

const makeFakeUserModel = (): UserModel => ({
  id: 'any_id',
  name: 'any name',
  email: 'any_email@mail.com',
  password: 'abcd1234',
  role: 'customer'
})

const makeFakeUserData = (): UserData => ({
  name: 'any name',
  email: 'any_email@mail.com',
  password: 'abcd1234'
})

type SutTypes = {
  sut: AddUserUseCase
  loadUserByEmailRepoStub: LoadUserByEmailRepo
}

const makeSut = (): SutTypes => {
  const loadUserByEmailRepoStub = makeLoadUserByEmailRepo()
  const sut = new AddUserUseCase(loadUserByEmailRepoStub)
  return {
    sut,
    loadUserByEmailRepoStub
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
})
