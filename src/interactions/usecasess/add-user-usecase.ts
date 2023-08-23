import { User, type UserData } from '../../domain/entities/user'
import type { AddUser, AddUserResponse } from '../../domain/usecases/add-user'
import { right } from '../../shared/either'

export class AddUserUseCase implements AddUser {
  async perform (data: UserData): Promise<AddUserResponse> {
    User.create(data)
    return right({ accesToken: 'any' })
  }
}
