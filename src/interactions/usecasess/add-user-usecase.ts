import { User, type UserData } from '@/domain/entities/user'
import type { AddUser, AddUserResponse } from '@/domain/usecases/add-user'
import { left, right } from '@/shared/either'
import type { LoadUserByEmailRepo } from '../contracts/db/load-user-by-email-repo'
import { EmailInUseError } from '../errors/email-in-use-error'

export class AddUserUseCase implements AddUser {
  constructor (private readonly loadUserByEmailRepo: LoadUserByEmailRepo) {}

  async perform (data: UserData): Promise<AddUserResponse> {
    const user = User.create(data)
    if (user.isLeft()) {
      return left(user.value)
    }
    const { email } = data
    const userOrNull = await this.loadUserByEmailRepo.loadByEmail(email)
    if (userOrNull) {
      return left(new EmailInUseError(email))
    }
    return right({ accesToken: 'any' })
  }
}
