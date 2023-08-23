import type { EmailInUseError } from '../../interactions/errors/email-in-use-error'
import type { Either } from '../../shared/either'
import type { InvalidEmailError, InvalidNameError, InvalidPasswordError } from '../entities/user/errors'

export interface AddUserData {
  name: string
  email: string
  password: string
}

export interface AccessToken {
  accesToken: string
}

export type AddUserResponse = Either<InvalidNameError | InvalidEmailError | InvalidPasswordError | EmailInUseError, AccessToken>

export interface AddUser {
  perform: (data: AddUserData) => Promise<AddUserResponse>
}
