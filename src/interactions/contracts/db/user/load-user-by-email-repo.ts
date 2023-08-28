import type { UserModel } from '@/domain/models'

export interface LoadUserByEmailRepo {
  loadByEmail: (email: string) => Promise<null | UserModel>
}
