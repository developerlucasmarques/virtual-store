import type { Event, EventManager, EventManagerData } from '@/domain/usecases-contracts'
import { EventNotFoundError } from '@/domain/usecases-contracts/errors'
import { left, right, type Either } from '@/shared/either'

export class EventManagerUseCase<T, D> implements EventManager<T, D> {
  private readonly eventHandlers: Map<T, Array<Event<any>>>

  constructor (private readonly eventConfig: { [key in T as string]: Array<Event<any>> }) {
    this.eventHandlers = new Map<T, Array<Event<any>>>()
    this.registerEventHandlers(this.eventConfig)
  }

  private registerEventHandlers (eventConfig: { [key in T as string]: Array<Event<any>> }): void {
    for (const eventType in eventConfig) {
      this.addToEventHandlers(eventType as T, eventConfig[eventType])
    }
  }

  private addToEventHandlers (eventType: T, event: Array<Event<any>>): void {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, [])
    }
    this.eventHandlers.get(eventType)?.push(...event)
  }

  private filterEventData (data: D, handler: Event<any>): Partial<D> {
    const eventDataSubset: Partial<D> = {}
    if (data !== null && typeof data === 'object') {
      for (const property of handler.reqProps) {
        if (property in data) {
          eventDataSubset[property as keyof Partial<D>] = data[property as keyof Partial<D>]
        }
      }
    }
    return eventDataSubset
  }

  async perform (data: EventManagerData<T, D>): Promise<Either<Error, null>> {
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
