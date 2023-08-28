import type { Controller } from '@/presentation/contracts'
import { LoginController } from '@/presentation/controllers/access/login-controller'
import { makeLogControllerDecorator } from '@/main/factories/decorators'
import { makeAuthUseCase } from '@/main/factories/usecases/access'
import { makeLoginValidation } from './login-validation-factory'

export const makeLoginController = (): Controller => {
  const controller = new LoginController(makeLoginValidation(), makeAuthUseCase())
  return makeLogControllerDecorator(controller)
}
