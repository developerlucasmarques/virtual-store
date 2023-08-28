import type { Controller } from '@/presentation/contracts'
import { LogControllerDecorator } from '@/main/decorators/log-controller-decorator'
import { LogMongoRepo } from '@/external/db/mongo-db/log/log-mongo-repo'

export const makeLogControllerDecorator = (controller: Controller): Controller => {
  const logMongoRepository = new LogMongoRepo()
  return new LogControllerDecorator(controller, logMongoRepository)
}
