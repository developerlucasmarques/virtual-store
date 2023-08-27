import type { Router } from 'express'
import { makeSignUpController } from '../factories/controllers/signup/signup-factory'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeLoginController } from '../factories/controllers/login/login-factory'

export default async (router: Router): Promise<void> => {
  router.post('/signup', adaptRoute(makeSignUpController()))
  router.post('/login', adaptRoute(makeLoginController()))
}
