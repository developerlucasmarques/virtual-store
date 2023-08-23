import { type Either, left, right } from '../../../shared/either'
import type { InvalidNameError } from './errors'
import type { UserData } from './user-data'
import { Name } from './value-objects'

export class User {
  private constructor (
    private readonly name: string
  ) {}

  static create (data: UserData): Either<InvalidNameError, User> {
    const name = Name.create(data.name)
    if (name.isLeft()) {
      return left(name.value)
    }
    return right(new User(data.name))
  }
}
