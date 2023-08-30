import { SignUpController } from '@/presentation/controllers/access'
import { makeLogControllerDecorator } from '@/main/factories/decorators'
import type { Controller } from '@/presentation/contracts'
import { makeSignUpValidation } from './signup-validation-factory'
import { makeAddUserUseCase } from '@/main/factories/usecases/user'

export const makeSignUpController = (): Controller => {
  const controller = new SignUpController(makeSignUpValidation(), makeAddUserUseCase())
  return makeLogControllerDecorator(controller)
}
