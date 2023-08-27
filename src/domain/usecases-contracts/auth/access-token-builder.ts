import type { AccessTokenModel } from '@/domain/models'

export interface AccessTokenBuilder {
  perform: (value: string) => Promise<AccessTokenModel>
}
