import type { Either } from '@/shared/either'

export type EventType = 'PaymentSuccess' | 'PaymentFailure'

export type EventData = {
  userId: string
  userName: string
  userEmail: string
  purchaseIntentId: string
}

export type EventManagerData = {
  eventType: EventType
  eventData: EventData
}

export interface EventManager {
  perform: (data: EventManagerData) => Promise<Either<Error, null>>
}
