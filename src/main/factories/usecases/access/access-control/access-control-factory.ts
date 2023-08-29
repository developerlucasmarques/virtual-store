import type { AccessControl } from '@/domain/usecases-contracts'
import { JwtAdapter } from '@/external/criptography/jwt-adapter/jwt-adapter'
import { UserMongoRepo } from '@/external/db/mongo-db/user/user-mongo-repo'
import { AccessControlUseCase } from '@/interactions/usecases/access/access-control-usecase'
import env from '@/main/config/env'

export const makeAccessControlUseCase = (): AccessControl => {
  const jwtAdapter = new JwtAdapter(env.jwtSecretKey)
  const userMongoRepo = new UserMongoRepo()
  return new AccessControlUseCase(jwtAdapter, userMongoRepo)
}
