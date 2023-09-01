import type { Either } from '@/shared/either'
import type { UserData } from '@/domain/entities/user'
import type { InvalidEmailError, InvalidNameError, InvalidPasswordError } from '@/domain/entities/user/errors'
import type { EmailInUseError } from '../errors'
import type { AccessTokenModel } from '@/domain/models'

export type AddUserResponse = Either<
InvalidNameError | InvalidEmailError | InvalidPasswordError | EmailInUseError, AccessTokenModel
>

export interface AddUser {
  perform: (data: UserData) => Promise<AddUserResponse>
}
