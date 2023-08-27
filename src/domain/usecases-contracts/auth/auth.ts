import type { Either } from '@/shared/either'
import type { InvalidEmailError } from '@/domain/entities/user/errors'
import type { InvalidCredentialsError } from './errors/invalid-credentials-error'
import type { AccessTokenModel } from '@/domain/models'

export type AuthData = {
  email: string
  password: string
}

export type AuthResponse = Either<InvalidEmailError | InvalidCredentialsError, AccessTokenModel>

export interface Auth {
  perform: (data: AuthData) => Promise<AuthResponse>
}
