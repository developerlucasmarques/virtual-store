import type { UserModel } from '@/domain/models'

export interface AddUserRepo {
  add: (data: UserModel) => Promise<void>
}
