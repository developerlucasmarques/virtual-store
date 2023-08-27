import { User } from '@/domain/entities/user'
import { InvalidCredentialsError, type Auth, type AuthData, type AuthResponse } from '@/domain/usecases-contracts'
import type { HashComparer, LoadUserByEmailRepo } from '@/interactions/contracts'
import { left, right } from '@/shared/either'

export class AuthUseCase implements Auth {
  constructor (
    private readonly loadUserByEmailRepo: LoadUserByEmailRepo,
    private readonly hashComparer: HashComparer
  ) {}

  async perform (data: AuthData): Promise<AuthResponse> {
    const { email, password } = data
    const emailOrError = User.validateEmail(email)
    if (emailOrError.isLeft()) {
      return left(emailOrError.value)
    }
    const user = await this.loadUserByEmailRepo.loadByEmail(email)
    if (!user) {
      return left(new InvalidCredentialsError())
    }
    await this.hashComparer.comparer({ value: password, hash: user.password })
    return right({ accessToken: 'any' })
  }
}
