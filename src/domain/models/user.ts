import type { RoleModel } from './role'

export type UserModel = {
  id: string
  name: string
  email: string
  password: string
  role: RoleModel
  accessToken: string
}
