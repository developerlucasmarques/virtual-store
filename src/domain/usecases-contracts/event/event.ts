import type { Either } from '@/shared/either'

export type EventData = {
  userId: string
  userName: string
  userEmail: string
  purchaseIntentId: string
}

export interface Event {
  perform: (data: EventData) => Promise<Either<Error, null>>
}
