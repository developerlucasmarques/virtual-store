import type { AddOrderData, Event, EventData, EventManager, EventManagerData, EventName } from '@/domain/usecases-contracts'
import { EventNotFoundError } from '@/domain/usecases-contracts/errors'
import { left, right, type Either } from '@/shared/either'

type EventHandler = Map<EventName, Array<{ event: Event<any>, reqProps: Array<keyof any> }>>
type Handler = { event: Event<any>, reqProps: Array<keyof any> }
type HandlerMap = Record<EventName, Array<{ event: Event<any>, reqProps: Array<keyof any> }>>

export class EventManagerUseCase implements EventManager {
  private readonly handlers: EventHandler

  constructor (
    private readonly addOrder: Event<AddOrderData>
  ) {
    this.handlers = new Map<EventName, Array<{ event: Event<any>, reqProps: Array<keyof any> }>>()
    this.registerHandlers({
      PaymentSuccess: [
        { event: this.addOrder, reqProps: this.addOrder.reqProps }
      ],
      PaymentFailure: []
    })
  }

  private registerHandlers (handlerMap: HandlerMap): void {
    Object.entries(handlerMap).forEach(([eventName, event]) => {
      const typedEventName = eventName as EventName
      if (!this.handlers.has(typedEventName)) {
        this.handlers.set(typedEventName, [])
      }
      this.handlers.get(typedEventName)?.push(...event)
    })
  }

  private filterEventData (data: EventData, handler: Handler): Partial<EventData> {
    const eventDataSubset: Partial<EventData> = {}
    for (const property of handler.reqProps) {
      eventDataSubset[property as keyof typeof data] = data[property as keyof typeof data]
    }
    return eventDataSubset
  }

  async handle (data: EventManagerData): Promise<Either<Error, null>> {
    const handlers = this.handlers.get(data.eventName)
    if (handlers) {
      for (const handler of handlers) {
        const eventDataSubset = this.filterEventData(data.eventData, handler)
        const result = await handler.event.perform(eventDataSubset)
        if (result.isLeft()) {
          return left(result.value)
        }
      }
      return right(null)
    }
    return left(new EventNotFoundError())
  }
}
