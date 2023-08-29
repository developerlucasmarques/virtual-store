import { AccessTokenNotInformedError } from '../errors'
import { unauthorized } from '../helpers/http/http-helpers'
import { AccessControlMiddleware } from './access-control-middleware'

describe('AccessControl Middleware', () => {
  it('Should return 401 if x-access-token not provided in headers', async () => {
    const sut = new AccessControlMiddleware()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(unauthorized(new AccessTokenNotInformedError()))
  })
})
