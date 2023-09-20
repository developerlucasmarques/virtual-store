import type { Either } from '@/shared/either'

export type EventManagerData<T, D> = {
  eventType: T
  eventData: D
}

export interface EventManager<T, D> {
  perform: (data: EventManagerData<T, D>) => Promise<Either<Error, null>>
}
