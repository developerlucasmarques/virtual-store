import type { CartModel } from '@/domain/models'

export interface LoadCartByUserIdRepo {
  loadByUserId: (userId: string) => Promise<null | CartModel>
}
