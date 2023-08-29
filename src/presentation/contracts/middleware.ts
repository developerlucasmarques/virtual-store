import type { HttpRequest, HttpResponse } from '../http-types/http'

export interface Middleware {
  handle: (httpRequest: HttpRequest) => Promise<HttpResponse>
}
