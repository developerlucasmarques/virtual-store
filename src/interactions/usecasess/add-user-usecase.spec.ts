import { User, type UserData } from '@/domain/entities/user'
import { left } from '@/shared/either'
import { AddUserUseCase } from './add-user-usecase'

const makeFakeUserData = (): UserData => ({
  name: 'any name',
  email: 'any_email@mail.com',
  password: 'abcd1234'
})

interface SutTypes {
  sut: AddUserUseCase
}

const makeSut = (): SutTypes => {
  const sut = new AddUserUseCase()
  return { sut }
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
})
