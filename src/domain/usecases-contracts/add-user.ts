import type { EmailInUseError } from '@/interactions/errors/email-in-use-error'
import type { Either } from '@/shared/either'
import type { UserData } from '../entities/user'
import type { InvalidEmailError, InvalidNameError, InvalidPasswordError } from '../entities/user/errors'
import type { AccessToken } from './access-token-builder'

export type AddUserResponse = Either<
InvalidNameError | InvalidEmailError | InvalidPasswordError | EmailInUseError, AccessToken
>

export interface AddUser {
  perform: (data: UserData) => Promise<AddUserResponse>
}
