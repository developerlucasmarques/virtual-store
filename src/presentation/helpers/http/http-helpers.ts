import { ServerError } from '@/presentation/errors/server-error'
import type { HttpResponse } from '@/presentation/http-types/http'

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
})

export const serverError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error.stack)
})
