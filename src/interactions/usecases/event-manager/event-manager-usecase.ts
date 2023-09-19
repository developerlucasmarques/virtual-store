import type { Event, EventManager, EventManagerData, EventType } from '@/domain/usecases-contracts'
import { EventNotFoundError } from '@/domain/usecases-contracts/errors'
import { left, right, type Either } from '@/shared/either'

export type EventConfig = Record<EventType, Array<Event<any>>>

export class EventManagerUseCase<T> implements EventManager {
  private readonly eventHandlers: Map<EventType, Array<Event<any>>>

  constructor (private readonly eventConfig: EventConfig) {
    this.eventHandlers = new Map<EventType, Array<Event<any>>>()
    this.registerEventHandlers(this.eventConfig)
  }

  private registerEventHandlers (eventConfig: EventConfig): void {
    for (const eventType in eventConfig) {
      const eventHandlers = eventConfig[eventType as EventType]
      this.addToEventHandlers(eventType as EventType, eventHandlers)
    }
  }

  private addToEventHandlers (eventType: EventType, event: Array<Event<any>>): void {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, [])
    }
    this.eventHandlers.get(eventType)?.push(...event)
  }

  private filterEventData (data: T, handler: Event<any>): Partial<T> {
    const eventDataSubset: Partial<T> = {}
    for (const property of handler.reqProps) {
      eventDataSubset[property as keyof typeof data] = data[property as keyof typeof data]
    }
    return eventDataSubset
  }

  async perform (data: EventManagerData<T>): Promise<Either<Error, null>> {
    const eventHandlers = this.eventHandlers.get(data.eventType)
    if (eventHandlers && eventHandlers.length !== 0) {
      for (const eventHandler of eventHandlers) {
        const eventDataSubset = this.filterEventData(data.eventData, eventHandler)
        const result = await eventHandler.perform(eventDataSubset)
        if (result.isLeft()) {
          return left(result.value)
        }
      }
      return right(null)
    }
    return left(new EventNotFoundError())
  }
}

// type AnotherEventPaymentSuccessData = {
//   userEmail: string
//   userId: string
//   userName: string
// }

// const makeAnotherEventPaymentSuccess = (): Event<AnotherEventPaymentSuccessData> => {
//   class AnotherEventPaymentSuccessStub implements Event<AnotherEventPaymentSuccessData> {
//     reqProps: Array<keyof AnotherEventPaymentSuccessData> = ['userEmail', 'userId', 'userName']
//     async perform (data: AnotherEventPaymentSuccessData): Promise<Either<Error, null>> {
//       return right(null)
//     }
//   }
//   return new AnotherEventPaymentSuccessStub()
// }
// const a = makeAnotherEventPaymentSuccess()
// const t = new EventManagerUseCase(makeAnotherEventPaymentSuccess())
