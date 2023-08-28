import { ServerError } from '@/presentation/errors/server-error'
import type { HttpResponse } from '@/presentation/http-types/http'

export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data
})

export const created = (data: any): HttpResponse => ({
  statusCode: 201,
  body: data
})

export const noContent = (): HttpResponse => ({
  statusCode: 204,
  body: null
})

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
})

export const unauthorized = (error: Error): HttpResponse => ({
  statusCode: 401,
  body: error
})

export const serverError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error.stack)
})
