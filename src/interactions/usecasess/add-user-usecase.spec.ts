import { User, type UserData } from '../../domain/entities/user'
import { AddUserUseCase } from './add-user-usecase'

const makeUserData = (): UserData => ({
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
    await sut.perform(makeUserData())
    expect(createSpy).toHaveBeenCalledWith(makeUserData())
  })
})
