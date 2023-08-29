import type { AccessControl, AccessControlData, AccessControlResponse } from '@/domain/usecases-contracts'
import { AccessDeniedError, InvalidTokenError } from '@/domain/usecases-contracts/export-errors'
import type { Decrypter, LoadUserByIdRepo } from '@/interactions/contracts'
import { left, right } from '@/shared/either'

export class AccessControlUseCase implements AccessControl {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly loadUserByIdRepo: LoadUserByIdRepo
  ) {}

  async perform (data: AccessControlData): Promise<AccessControlResponse> {
    const id = await this.decrypter.decrypt(data.accessToken)
    if (!id) {
      return left(new InvalidTokenError())
    }
    const user = await this.loadUserByIdRepo.loadById(id)
    if (!user) {
      return left(new AccessDeniedError())
    }
    return right({ userId: '' })
  }
}
