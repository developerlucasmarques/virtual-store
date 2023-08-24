export type RoleModel = 'admin' | 'customer'

export type UserModel = {
  id: string
  name: string
  email: string
  password: string
  role: RoleModel
  accessToken: string
}
