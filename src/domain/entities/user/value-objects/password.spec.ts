import { InvalidPasswordError } from '../errors'
import { Password } from './password'

describe('Password Value Object', () => {
  it('Should return InvalidPasswordError if password not provided', () => {
    const sut = Password.create('')
    expect(sut.value).toEqual(new InvalidPasswordError(''))
  })

  it('Should return InvalidPasswordError if password is less than 8 characters', () => {
    const sut = Password.create('abc1234')
    expect(sut.value).toEqual(new InvalidPasswordError('abc1234'))
  })

  it('Should return InvalidPasswordError if password is more than 128 characters', () => {
    const password = 'a1'.repeat(65)
    const sut = Password.create(password)
    expect(sut.value).toEqual(new InvalidPasswordError(password))
  })

  it('Should return InvalidPasswordError if password contains only numbers', () => {
    const sut = Password.create('12345678')
    expect(sut.value).toEqual(new InvalidPasswordError('12345678'))
  })

  it('Should return InvalidPasswordError if password contains only letters', () => {
    const sut = Password.create('abcdefgh')
    expect(sut.value).toEqual(new InvalidPasswordError('abcdefgh'))
  })

  it('Should return Password if passowrd is valid', () => {
    const sut = Password.create('abcd1234')
    expect(sut.value).toEqual({ password: 'abcd1234' })
  })
})
