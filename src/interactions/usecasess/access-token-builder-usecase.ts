import type { AccessTokenBuilder } from '@/domain/usecases-contracts'
import type { Encrypter } from '../contracts'
import type { AccessTokenModel } from '@/domain/models'

export class AccessTokenBuilderUseCase implements AccessTokenBuilder {
  constructor (private readonly encrypter: Encrypter) {}

  async perform (value: string): Promise<AccessTokenModel> {
    const { token } = await this.encrypter.encrypt({ value, expiresInHours: 24 })
    return { accessToken: token }
  }
}
