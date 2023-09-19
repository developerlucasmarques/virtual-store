import type { Event, EventManager, EventManagerData } from '@/domain/usecases-contracts'
import { EventNotFoundError } from '@/domain/usecases-contracts/errors'
import { left, right, type Either } from '@/shared/either'

export class EventManagerUseCase<Type, Data> implements EventManager<Type, Data> {
  private readonly eventHandlers: Map<Type, Array<Event<any>>>

  constructor (private readonly eventConfig: { [key in Type as string]: Array<Event<any>> }) {
    this.eventHandlers = new Map<Type, Array<Event<any>>>()
    this.registerEventHandlers(this.eventConfig)
  }

  private registerEventHandlers (eventConfig: { [key in Type as string]: Array<Event<any>> }): void {
    for (const eventType in eventConfig) {
      this.addToEventHandlers(eventType as Type, eventConfig[eventType])
    }
  }

  private addToEventHandlers (eventType: Type, event: Array<Event<any>>): void {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, [])
    }
    this.eventHandlers.get(eventType)?.push(...event)
  }

  private filterEventData (data: Data, handler: Event<any>): Partial<Data> {
    const eventDataSubset: Partial<Data> = {}
    if (data !== null && typeof data === 'object') {
      for (const property of handler.reqProps) {
        if (property in data) {
          eventDataSubset[property as keyof Partial<Data>] = data[property as keyof Partial<Data>]
        }
      }
    }
    return eventDataSubset
  }

  async perform (data: EventManagerData<Type, Data>): Promise<Either<Error, null>> {
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
