import type { UserModel } from '@/domain/entities/user'

export interface LoadUserByEmailRepo {
  loadByEmail: (email: string) => Promise<null | UserModel>
}
