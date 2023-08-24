import { User, type UserData } from '@/domain/entities/user'
import type { AddUser, AddUserResponse } from '@/domain/usecases/add-user'
import { left, right } from '@/shared/either'
import type { LoadUserByEmailRepo } from '../contracts/db/load-user-by-email-repo'
import { EmailInUseError } from '../errors/email-in-use-error'
import type { Hasher } from '../contracts/cryptography/hasher'
import type { IdBuilder } from '../contracts/id/id-builder'

export class AddUserUseCase implements AddUser {
  constructor (
    private readonly loadUserByEmailRepo: LoadUserByEmailRepo,
    private readonly hasher: Hasher,
    private readonly idBuilder: IdBuilder
  ) {}

  async perform (data: UserData): Promise<AddUserResponse> {
    const user = User.create(data)
    if (user.isLeft()) {
      return left(user.value)
    }
    const { email, password } = data
    const userOrNull = await this.loadUserByEmailRepo.loadByEmail(email)
    if (userOrNull) {
      return left(new EmailInUseError(email))
    }
    await this.hasher.hashing(password)
    this.idBuilder.build()
    return right({ accesToken: 'any' })
  }
}
