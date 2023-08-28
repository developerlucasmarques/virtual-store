import type { Auth } from '@/domain/usecases-contracts'
import { BcryptAdapter } from '@/external/criptography/bcrypt-adapter/bcrypt-adapter'
import { UserMongoRepo } from '@/external/db/mongo-db/user/user-mongo-repo'
import { AuthUseCase } from '@/interactions/usecases/access/auth-usecase'
import { makeAccessTokenBuilderUseCase } from '../'

export const makeAuthUseCase = (): Auth => {
  const userMongoRepo = new UserMongoRepo()
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  return new AuthUseCase(userMongoRepo, bcryptAdapter, makeAccessTokenBuilderUseCase(), userMongoRepo)
}
