import type { Router } from 'express'
import { makeSignUpController } from '../factories/controllers/signup/signup-factory'
import { adaptRoute } from '../adapters/express-route-adapter'

export default async (router: Router): Promise<void> => {
  router.post('/signup', adaptRoute(makeSignUpController()))
}
