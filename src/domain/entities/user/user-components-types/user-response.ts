import type { Either } from '@/shared/either'
import type { InvalidEmailError, InvalidNameError, InvalidPasswordError } from '../errors'
import type { User } from '../user'

export type UserResponse = Either<
InvalidNameError | InvalidEmailError | InvalidPasswordError, User
>
