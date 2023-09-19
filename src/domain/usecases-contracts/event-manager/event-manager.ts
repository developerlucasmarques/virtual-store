import type { Either } from '@/shared/either'
import type { Event } from './event'

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

export type EventHandler<T> = { event: Event<T> }
export type EventConfigList = Array<Record<EventType, Array<EventHandler<any>>>>

export interface EventManager {
  perform: (data: EventManagerData) => Promise<Either<Error, null>>
}
