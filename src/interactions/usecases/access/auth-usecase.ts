import { User } from '@/domain/entities/user'
import type { Auth, AuthData, AuthResponse } from '@/domain/usecases-contracts'
import { left, right } from '@/shared/either'

export class AuthUseCase implements Auth {
  async perform (data: AuthData): Promise<AuthResponse> {
    const emailOrError = User.validateEmail(data.email)
    if (emailOrError.isLeft()) {
      return left(emailOrError.value)
    }
    return right({ accessToken: 'any' })
  }
}
