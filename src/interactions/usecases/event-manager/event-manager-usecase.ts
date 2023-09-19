import type { Event, EventConfigList, EventData, EventHandler, EventManager, EventManagerData, EventType } from '@/domain/usecases-contracts'
import { EventNotFoundError } from '@/domain/usecases-contracts/errors'
import { left, right, type Either } from '@/shared/either'

type EventHandlerMap = Map<EventType, Array<{ event: Event<any> }>>

export class EventManagerUseCase implements EventManager {
  private readonly eventHandlers: EventHandlerMap

  constructor (private readonly eventConfigList: EventConfigList) {
    this.eventHandlers = new Map<EventType, Array<{ event: Event<any> }>>()
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

  private addToEventHandlers (eventType: EventType, event: Array<EventHandler<any>>): void {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, [])
    }
    this.eventHandlers.get(eventType)?.push(...event)
  }

  private filterEventData (data: EventData, handler: EventHandler<any>): Partial<EventData> {
    const eventDataSubset: Partial<EventData> = {}
    for (const property of handler.event.reqProps) {
      eventDataSubset[property as keyof typeof data] = data[property as keyof typeof data]
    }
    return eventDataSubset
  }

  async perform (data: EventManagerData): Promise<Either<Error, null>> {
    const eventHandlers = this.eventHandlers.get(data.eventType)
    if (eventHandlers && eventHandlers.length !== 0) {
      for (const eventHandler of eventHandlers) {
        const eventDataSubset = this.filterEventData(data.eventData, eventHandler)
        const result = await eventHandler.event.perform(eventDataSubset)
        if (result.isLeft()) {
          return left(result.value)
        }
      }
      return right(null)
    }
    return left(new EventNotFoundError())
  }
}
