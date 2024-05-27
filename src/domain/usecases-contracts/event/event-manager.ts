import type { Either } from '@/shared/either'
import type { EventNotFoundError } from '../errors'

export type EventManagerData<T, D> = {
  eventType: T
  eventData: D
}

export interface EventManager<T, D> {
  perform: (data: EventManagerData<T, D>) => Promise<Either<EventNotFoundError, null>>
}
