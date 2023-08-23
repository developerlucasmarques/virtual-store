import { User } from '../../domain/entities/user'
import { AddUserUseCase } from './add-user-usecase'

describe('AddUser UseCase', () => {
  it('Should call User Entity with correct values', async () => {
    const sut = new AddUserUseCase()
    const createSpy = jest.spyOn(User, 'create')
    await sut.perform({
      name: 'any name',
      email: 'any_email@mail.com',
      password: 'abcd1234'
    })
    expect(createSpy).toHaveBeenCalledWith({
      name: 'any name',
      email: 'any_email@mail.com',
      password: 'abcd1234'
    })
  })
})
