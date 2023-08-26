import type { AccessTokenBuilder } from '@/domain/usecases-contracts'
import { JwtAdapter } from '@/external/criptography/jwt-adapter/jwt-adapter'
import { AccessTokenBuilderUseCase } from '@/interactions/usecasess/access-token-builder-usecase'
import env from '@/main/config/env'

export const makeAccessTokenBuilderUseCase = (): AccessTokenBuilder => {
  const jwtAdapter = new JwtAdapter(env.jwtSecretKey)
  return new AccessTokenBuilderUseCase(jwtAdapter)
}
