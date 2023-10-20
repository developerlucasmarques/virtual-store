import type { Event, EventManager, EventManagerData } from '@/domain/usecases-contracts'
import { EventNotFoundError } from '@/domain/usecases-contracts/errors'
import { left, right, type Either } from '@/shared/either'

export class EventManagerUseCase<T extends string, D> implements EventManager<T, D> {
  private readonly eventHandlers: Map<T, Array<Event<any>>>

  constructor (private readonly eventConfig: { [key in T]: Array<Event<any>> }) {
    this.eventHandlers = new Map<T, Array<Event<any>>>()
    this.registerEventHandlers(this.eventConfig)
  }

  private registerEventHandlers (eventConfig: { [key in T]: Array<Event<any>> }): void {
    for (const eventType in eventConfig) {
      if (!this.eventHandlers.has(eventType)) {
        this.eventHandlers.set(eventType, [])
      }
      this.eventHandlers.get(eventType)?.push(...eventConfig[eventType])
    }
  }

  private filterEventData (data: D, handler: Event<any>): Partial<D> {
    const eventDataSubset: Partial<D> = {}
    if (data !== null && typeof data === 'object') {
      for (const property of handler.requiredProps) {
        if (property in data) {
          eventDataSubset[property as keyof Partial<D>] = data[property as keyof Partial<D>]
        }
      }
    }
    return eventDataSubset
  }

  async perform (data: EventManagerData<T, D>): Promise<Either<EventNotFoundError, null>> {
    const eventHandlers = this.eventHandlers.get(data.eventType)
    if (eventHandlers && eventHandlers.length !== 0) {
      for (const eventHandler of eventHandlers) {
        const eventDataSubset = this.filterEventData(data.eventData, eventHandler)
        await eventHandler.perform(eventDataSubset)
      }
      return right(null)
    }
    return left(new EventNotFoundError())
  }
}
