import { SignUpController } from '@/presentation/controllers/signup-controller'
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory'
import type { Controller } from '@/presentation/contracts'
import { makeSignUpValidation } from './signup-validation-factory'
import { makeAddUserUseCase } from '../../usecases/add-user/add-user-usecase-factory'

export const makeSignUpController = (): Controller => {
  const controller = new SignUpController(makeSignUpValidation(), makeAddUserUseCase())
  return makeLogControllerDecorator(controller)
}
