import type { AccessToken, AccessTokenBuilder } from '@/domain/usecases'
import type { AccessTokenEcrypter } from '../contracts'

export class AccessTokenBuilderUseCase implements AccessTokenBuilder {
  constructor (private readonly accessTokenEncrypter: AccessTokenEcrypter) {}

  build (value: string): AccessToken {
    this.accessTokenEncrypter.encryptAccessToken({
      value,
      expiresInHours: 24
    })
    return { accessToken: '' }
  }
}
