import type { RoleModel } from '@/domain/models'
import type { Either } from '@/shared/either'
import type { AccessDeniedError, InvalidTokenError } from '../errors'

export type AccessControlData = {
  accessToken: string
  role: RoleModel
}

export type UserId = {
  userId: string
}

export type AccessControlResponse = Either<InvalidTokenError | AccessDeniedError, UserId>

export interface AccessControl {
  perform: (data: AccessControlData) => Promise<AccessControlResponse>
}
