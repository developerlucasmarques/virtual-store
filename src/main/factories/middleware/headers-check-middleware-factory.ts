import type { Middleware } from '@/presentation/contracts'
import { HeadersCheckMiddleware } from '@/presentation/middlewares/headers-check-middleware'
import { makeHeadersCheckMiddlewareValidation } from './headers-check-middleware-validation-factory'

export const makeHeadersCheckMiddleware = (): Middleware => {
  return new HeadersCheckMiddleware(makeHeadersCheckMiddlewareValidation())
}
