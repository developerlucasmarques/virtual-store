import type { RoleModel } from '@/domain/models'
import type { Middleware } from '@/presentation/contracts/middleware'
import { AccessControlMiddleware } from '@/presentation/middlewares/access-control-middleware'
import { makeAccessControlUseCase } from '../usecases/access/access-control/access-control-factory'

export const makeAccessControlMiddleware = (role: RoleModel): Middleware => {
  return new AccessControlMiddleware(makeAccessControlUseCase(), role)
}
