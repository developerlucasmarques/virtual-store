import type { Either } from '@/shared/either'

export type EventType = 'PaymentSuccess' | 'PaymentFailure'

export type EventManagerData<T> = {
  eventType: EventType
  eventData: T
}

export interface EventManager {
  perform: (data: EventManagerData<any>) => Promise<Either<Error, null>>
}
