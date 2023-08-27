import { User } from '@/domain/entities/user'
import { InvalidCredentialsError, type Auth, type AuthData, type AuthResponse } from '@/domain/usecases-contracts'
import type { LoadUserByEmailRepo } from '@/interactions/contracts'
import { left, right } from '@/shared/either'

export class AuthUseCase implements Auth {
  constructor (private readonly loadUserByEmailRepo: LoadUserByEmailRepo) {}

  async perform (data: AuthData): Promise<AuthResponse> {
    const emailOrError = User.validateEmail(data.email)
    if (emailOrError.isLeft()) {
      return left(emailOrError.value)
    }
    const userOrNull = await this.loadUserByEmailRepo.loadByEmail(data.email)
    if (!userOrNull) {
      return left(new InvalidCredentialsError())
    }
    return right({ accessToken: 'any' })
  }
}
