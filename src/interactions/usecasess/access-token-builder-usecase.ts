import type { AccessToken, AccessTokenBuilder } from '@/domain/usecases'
import type { Ecrypter } from '../contracts'

export class AccessTokenBuilderUseCase implements AccessTokenBuilder {
  constructor (private readonly encrypter: Ecrypter) {}

  async perform (value: string): Promise<AccessToken> {
    await this.encrypter.encrypt({
      value,
      expiresInHours: 24
    })
    return { accessToken: '' }
  }
}
