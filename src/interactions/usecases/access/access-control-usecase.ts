import type { AccessControl, AccessControlData, AccessControlResponse } from '@/domain/usecases-contracts'
import { InvalidTokenError } from '@/domain/usecases-contracts/export-errors'
import type { Decrypter } from '@/interactions/contracts'
import { left, right } from '@/shared/either'

export class AccessControlUseCase implements AccessControl {
  constructor (private readonly decrypter: Decrypter) {}

  async perform (data: AccessControlData): Promise<AccessControlResponse> {
    const decryptResult = await this.decrypter.decrypt(data.accessToken)
    if (!decryptResult) {
      return left(new InvalidTokenError())
    }
    return right({ userId: '' })
  }
}
