import { type Either, left, right } from '../../../shared/either'
import type { InvalidEmailError, InvalidNameError, InvalidPasswordError } from './errors'
import type { UserData } from './user-data'
import { Email, Name, Password } from './value-objects'

export class User {
  private constructor (
    private readonly name: string
  ) {}

  static create (data: UserData): Either<InvalidNameError | InvalidEmailError | InvalidPasswordError, User> {
    const name = Name.create(data.name)
    if (name.isLeft()) {
      return left(name.value)
    }
    const email = Email.create(data.email)
    if (email.isLeft()) {
      return left(email.value)
    }
    const password = Password.create(data.password)
    if (password.isLeft()) {
      return left(password.value)
    }
    return right(new User(data.name))
  }
}
