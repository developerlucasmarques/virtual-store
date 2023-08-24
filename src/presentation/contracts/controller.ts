import type { HttpRequest, HttpResponse } from '../http-types/http'

export interface Controller {
  handle: (httpRequest: HttpRequest) => Promise<HttpResponse>
}
