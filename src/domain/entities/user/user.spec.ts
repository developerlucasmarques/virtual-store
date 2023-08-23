import { left } from '../../../shared/either'
import { InvalidEmailError, InvalidNameError, InvalidPasswordError } from './errors'
import { User } from './user'
import type { UserData } from './user-data'
import { Email, Name, Password } from './value-objects'

const makeUserData = (): UserData => ({
  name: 'any name',
  email: 'any_email@mail.com',
  password: 'abcd1234'
})

describe('User Entity', () => {
  it('Should return InvalidNameError if create Name fails', () => {
    jest.spyOn(Name, 'create').mockReturnValueOnce(
      left(new InvalidNameError('any_name'))
    )
    const sut = User.create(makeUserData())
    expect(sut.value).toEqual(new InvalidNameError('any_name'))
  })

  it('Should return InvalidEmailError if create Email fails', () => {
    jest.spyOn(Email, 'create').mockReturnValueOnce(
      left(new InvalidEmailError('any_email@mail.com'))
    )
    const sut = User.create(makeUserData())
    expect(sut.value).toEqual(new InvalidEmailError('any_email@mail.com'))
  })

  it('Should return InvalidPasswordError if create Password fails', () => {
    jest.spyOn(Password, 'create').mockReturnValueOnce(
      left(new InvalidPasswordError('abcd1234'))
    )
    const sut = User.create(makeUserData())
    expect(sut.value).toEqual(new InvalidPasswordError('abcd1234'))
  })
})
