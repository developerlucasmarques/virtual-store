import { User } from '@/domain/entities/user'
import type { Auth, AuthData, AuthResponse } from '@/domain/usecases-contracts'
import { right } from '@/shared/either'

export class AuthUseCase implements Auth {
  async perform (data: AuthData): Promise<AuthResponse> {
    User.validateEmail(data.email)
    return right({ accessToken: 'any' })
  }
}
