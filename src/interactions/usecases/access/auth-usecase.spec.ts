import { User } from '@/domain/entities/user'
import { AuthUseCase } from './auth-usecase'
import { left } from '@/shared/either'
import { InvalidEmailError } from '@/domain/entities/user/errors'

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

  it('Should return InvalidEmailError if User Entity validateEmail returs InvalidEmailError', async () => {
    const sut = new AuthUseCase()
    jest.spyOn(User, 'validateEmail').mockReturnValueOnce(
      left(new InvalidEmailError('any_email@mail.com'))
    )
    const result = await sut.perform({
      email: 'any_email@mail.com',
      password: 'abcd1234'
    })
    expect(result.value).toEqual(new InvalidEmailError('any_email@mail.com'))
  })
})
