import { left } from '../../../shared/either'
import { InvalidEmailError, InvalidNameError, InvalidPasswordError } from './errors'
import { type UserData, User } from '.'
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

  it('Should create User if all data is valid', () => {
    const sut = User.create(makeUserData())
    expect(sut.value).toEqual({
      name: Name.create('any name').value,
      email: Email.create('any_email@mail.com').value,
      password: Password.create('abcd1234').value
    })
  })
})
