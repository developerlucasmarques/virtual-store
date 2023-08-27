import { User } from '@/domain/entities/user'
import { AuthUseCase } from './auth-usecase'
import { left } from '@/shared/either'
import { InvalidEmailError } from '@/domain/entities/user/errors'
import type { AuthData } from '@/domain/usecases-contracts'

const makeFakeAuthData = (): AuthData => ({
  email: 'any_email@mail.com',
  password: 'abcd1234'
})

type SutTypes = {
  sut: AuthUseCase
}

const makeFakeSut = (): SutTypes => {
  const sut = new AuthUseCase()
  return {
    sut
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
})
