import type { AccessToken, AccessTokenBuilder } from '@/domain/usecases-contracts'
import type { Encrypter } from '../contracts'

export class AccessTokenBuilderUseCase implements AccessTokenBuilder {
  constructor (private readonly encrypter: Encrypter) {}

  async perform (value: string): Promise<AccessToken> {
    const { token } = await this.encrypter.encrypt({ value, expiresInHours: 24 })
    return { accessToken: token }
  }
}
