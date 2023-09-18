import { type Either } from '@/shared/either'

export type EventName = 'PaymentSuccess' | 'PaymentFailure'

export type EventData = {
  userId: string
  userName: string
  userEmail: string
  purchaseIntentId: string
}

export type EventManagerData = {
  eventName: EventName
  eventData: EventData
}

export interface EventManager {
  handle: (data: EventManagerData) => Promise<Either<Error, null>>
}
