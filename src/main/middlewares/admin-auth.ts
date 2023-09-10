import type { Middleware } from '@/presentation/contracts'
import { AccessControlMiddleware } from '@/presentation/middlewares/access-control-middleware'
import { makeAccessControlUseCase } from '../factories/usecases/access/access-control/access-control-factory'

export const makeAdminMiddleware = (): Middleware => {
  return new AccessControlMiddleware(makeAccessControlUseCase(), 'admin')
}
