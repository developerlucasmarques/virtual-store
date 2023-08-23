import { User, type UserData } from '../../domain/entities/user'
import type { AddUser, AddUserResponse } from '../../domain/usecases/add-user'
import { left, right } from '../../shared/either'

export class AddUserUseCase implements AddUser {
  async perform (data: UserData): Promise<AddUserResponse> {
    const user = User.create(data)
    if (user.isLeft()) {
      return left(user.value)
    }
    return right({ accesToken: 'any' })
  }
}
