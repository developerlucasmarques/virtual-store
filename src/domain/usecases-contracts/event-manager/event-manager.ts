import type { Either } from '@/shared/either'

export type EventManagerData<Type, Data> = {
  eventType: Type
  eventData: Data
}

export interface EventManager<Type, Data> {
  perform: (data: EventManagerData<Type, Data>) => Promise<Either<Error, null>>
}
