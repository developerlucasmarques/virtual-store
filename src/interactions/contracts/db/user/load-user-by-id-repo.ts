import type { UserModel } from '@/domain/models'

export interface LoadUserByIdRepo {
  loadById: (id: string) => Promise<null | UserModel>
}
