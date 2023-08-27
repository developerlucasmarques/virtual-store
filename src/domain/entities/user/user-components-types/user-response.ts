import type { Either } from '@/shared/either'
import type { InvalidEmailError, InvalidNameError, InvalidPasswordError } from '../errors'
import type { User } from '../user'
import type { Email } from '../value-objects'

export type UserResponse = Either<
InvalidNameError | InvalidEmailError | InvalidPasswordError, User
>

export type ValidateEmailResponse = Either <InvalidEmailError, Email>
