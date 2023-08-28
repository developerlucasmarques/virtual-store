import type { AccessControl, AccessControlData, AccessControlResponse } from '@/domain/usecases-contracts'
import type { Decrypter } from '@/interactions/contracts'
import { right } from '@/shared/either'

export class AccessControlUseCase implements AccessControl {
  constructor (private readonly decrypter: Decrypter) {}

  async perform (data: AccessControlData): Promise<AccessControlResponse> {
    await this.decrypter.decrypt(data.accessToken)
    return right({ userId: '' })
  }
}
