import type { Event, EventData, EventManager, EventManagerData, EventType } from '@/domain/usecases-contracts'
import { EventNotFoundError } from '@/domain/usecases-contracts/errors'
import { left, right, type Either } from '@/shared/either'

export type EventConfigList = Array<Record<EventType, Array<Event<any>>>>

export class EventManagerUseCase implements EventManager {
  private readonly eventHandlers: Map<EventType, Array<Event<any>>>

  constructor (private readonly eventConfigList: EventConfigList) {
    this.eventHandlers = new Map<EventType, Array<Event<any>>>()
    this.registerEventHandlers(this.eventConfigList)
  }

  private registerEventHandlers (eventConfigList: EventConfigList): void {
    eventConfigList.forEach((eventConfig) => {
      Object.keys(eventConfig).forEach((eventType) => {
        const typedEventType = eventType as EventType
        this.addToEventHandlers(typedEventType, eventConfig[typedEventType])
      })
    })
  }

  private addToEventHandlers (eventType: EventType, event: Array<Event<any>>): void {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, [])
    }
    this.eventHandlers.get(eventType)?.push(...event)
  }

  private filterEventData (data: EventData, handler: Event<any>): Partial<EventData> {
    const eventDataSubset: Partial<EventData> = {}
    for (const property of handler.reqProps) {
      eventDataSubset[property as keyof typeof data] = data[property as keyof typeof data]
    }
    return eventDataSubset
  }

  async perform (data: EventManagerData): Promise<Either<Error, null>> {
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
