import { InvalidEmailError } from '../errors'
import { Email } from './email'

describe('Email Value Object', () => {
  test('Should return InvalidEmailError if email not provided', () => {
    const sut = Email.create('')
    expect(sut.value).toEqual(new InvalidEmailError(''))
  })

  test('Should return InvalidEmailError if email without the at-sign', () => {
    const sut = Email.create('any_emailmail.com')
    expect(sut.value).toEqual(new InvalidEmailError('any_emailmail.com'))
  })

  test('Should return InvalidEmailError if email more than 64 characters on account part', () => {
    const accountPart = 'a'.repeat(65)
    const email = accountPart + '@mail.com'
    const sut = Email.create(email)
    expect(sut.value).toEqual(new InvalidEmailError(email))
  })

  test('Should return InvalidEmailError if email empty local part', () => {
    const sut = Email.create('@mail.com')
    expect(sut.value).toEqual(new InvalidEmailError('@mail.com'))
  })

  test('Should return InvalidEmailError if email invalid character in local part', () => {
    const sut = Email.create('any email@mail.com')
    expect(sut.value).toEqual(new InvalidEmailError('any email@mail.com'))
  })

  test('Should return InvalidEmailError if sending a dot as the first character of the email in the local part', () => {
    const sut = Email.create('.anyemail@mail.com')
    expect(sut.value).toEqual(new InvalidEmailError('.anyemail@mail.com'))
  })

  test('Should return InvalidEmailError if sending a dot as the last character of the email in the local part', () => {
    const sut = Email.create('anyemail.@mail.com')
    expect(sut.value).toEqual(new InvalidEmailError('anyemail.@mail.com'))
  })

  test('Should return InvalidEmailError if email more than 63 characters on domain part', () => {
    const domain = 'c'.repeat(64)
    const email = 'anyemial@' + domain + '.com'
    const sut = Email.create(email)
    expect(sut.value).toEqual(new InvalidEmailError(email))
  })

  test('Should remove the spaces at the beginning and at the end of the email', () => {
    const sut = Email.create('  any_email@mail.com   ')
    expect(sut.value).toEqual({ email: 'any_email@mail.com' })
  })

  test('Should return Email if email is valid', () => {
    const sut = Email.create('valid_email@mail.com')
    expect(sut.value).toEqual({ email: 'valid_email@mail.com' })
  })
})
