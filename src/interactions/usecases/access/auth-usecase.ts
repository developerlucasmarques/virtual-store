import { User } from '@/domain/entities/user'
import type { Auth, AuthData, AuthResponse } from '@/domain/usecases-contracts'
import type { LoadUserByEmailRepo } from '@/interactions/contracts'
import { left, right } from '@/shared/either'

export class AuthUseCase implements Auth {
  constructor (private readonly loadUserByEmailRepo: LoadUserByEmailRepo) {}

  async perform (data: AuthData): Promise<AuthResponse> {
    const emailOrError = User.validateEmail(data.email)
    if (emailOrError.isLeft()) {
      return left(emailOrError.value)
    }
    await this.loadUserByEmailRepo.loadByEmail(data.email)
    return right({ accessToken: 'any' })
  }
}
