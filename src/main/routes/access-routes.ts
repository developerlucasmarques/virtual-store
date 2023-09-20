import type { Router } from 'express'
import { makeSignUpController, makeLoginController } from '@/main/factories/controllers/access'
import { adaptRoute } from '@/main/adapters'

export default async (router: Router): Promise<void> => {
  router.post('/signup', adaptRoute(makeSignUpController()))
  router.post('/login', adaptRoute(makeLoginController()))
}
