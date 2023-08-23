import { left } from '../../../shared/either'
import { InvalidNameError } from './errors'
import { User } from './user'
import type { UserData } from './user-data'
import { Name } from './value-objects'

const makeUserData = (): UserData => ({
  name: 'any name',
  email: 'any_email@mail.com',
  password: 'abcd1234'
})

describe('User Entity', () => {
  test('Should return InvalidNameError if create Name fails', () => {
    jest.spyOn(Name, 'create').mockReturnValueOnce(
      left(new InvalidNameError('invalid_name'))
    )
    const sut = User.create(makeUserData())
    expect(sut.value).toEqual(new InvalidNameError('invalid_name'))
  })
})
