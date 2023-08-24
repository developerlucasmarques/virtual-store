import type { UserModel } from '@/domain/entities/user'

export interface AddUserRepo {
  add: (data: UserModel) => Promise<void>
}
