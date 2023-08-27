import { User, type UserData } from '@/domain/entities/user'
import { type AddUser, type AddUserResponse, type AccessTokenBuilder, EmailInUseError } from '@/domain/usecases-contracts'
import { left, right } from '@/shared/either'
import type { IdBuilder, AddUserRepo, LoadUserByEmailRepo, Hasher } from '../contracts'

export class AddUserUseCase implements AddUser {
  constructor (
    private readonly loadUserByEmailRepo: LoadUserByEmailRepo,
    private readonly hasher: Hasher,
    private readonly idBuilder: IdBuilder,
    private readonly accessTokenBuilder: AccessTokenBuilder,
    private readonly addUserRepo: AddUserRepo
  ) {}

  async perform (data: UserData): Promise<AddUserResponse> {
    const user = User.create(data)
    if (user.isLeft()) {
      return left(user.value)
    }
    const { name, email, password } = data
    const userOrNull = await this.loadUserByEmailRepo.loadByEmail(email)
    if (userOrNull) {
      return left(new EmailInUseError(email))
    }
    const { hash } = await this.hasher.hashing(password)
    const { id } = this.idBuilder.build()
    const { accessToken } = await this.accessTokenBuilder.perform(id)
    await this.addUserRepo.add({
      id, name, email, password: hash, role: 'customer', accessToken
    })
    return right({ accessToken })
  }
}
