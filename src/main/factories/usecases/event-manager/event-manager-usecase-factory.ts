import type { Event, EventManager } from '@/domain/usecases-contracts'
import { EventManagerUseCase } from '@/interactions/usecases/event-manager'

export const makeEventManagerUseCase = <T extends string, D>(
  eventConfig: { [key in T]: Array<Event<any>> }
): EventManager<T, D> => {
  return new EventManagerUseCase<T, D>(eventConfig)
}
