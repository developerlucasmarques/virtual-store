import { User } from '@/domain/entities/user'
import { AuthUseCase } from './auth-usecase'

describe('Auth UseCase', () => {
  it('Should call User Entity validateEmail with correct email', async () => {
    const sut = new AuthUseCase()
    const validateEmailSpy = jest.spyOn(User, 'validateEmail')
    await sut.perform({
      email: 'any_email@mail.com',
      password: 'abcd1234'
    })
    expect(validateEmailSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
})
