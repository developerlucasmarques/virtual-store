import type { Controller } from '@/presentation/contracts'
import { LoginController } from '@/presentation/controllers/login-controller'
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory'
import { makeAuthUseCase } from '../../usecases/auth/auth-usecase-factory'
import { makeLoginValidation } from './login-validation-factory'

export const makeLoginController = (): Controller => {
  const controller = new LoginController(makeLoginValidation(), makeAuthUseCase())
  return makeLogControllerDecorator(controller)
}
