import type { EmailInUseError } from '@/interactions/errors/email-in-use-error'
import type { Either } from '@/shared/either'
import type { UserData } from '../entities/user'
import type { InvalidEmailError, InvalidNameError, InvalidPasswordError } from '../entities/user/errors'

export type AccessToken = {
  accesToken: string
}

export type AddUserResponse = Either<
InvalidNameError | InvalidEmailError | InvalidPasswordError | EmailInUseError, AccessToken
>

export interface AddUser {
  perform: (data: UserData) => Promise<AddUserResponse>
}
