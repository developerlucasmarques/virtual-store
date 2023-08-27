import type { Either } from '@/shared/either'
import type { InvalidEmailError } from '../../entities/user/errors'
import type { InvalidCredentialsError } from './errors/invalid-credentials-error'

export type AuthData = {
  email: string
  password: string
}

export type AccessToken = {
  accessToken: string
}

type AuthResponse = Promise<Either<InvalidEmailError | InvalidCredentialsError, AccessToken>>

export interface Auth {
  perform: (data: AuthData) => AuthResponse
}
