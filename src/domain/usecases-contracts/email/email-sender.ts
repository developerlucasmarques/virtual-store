import type { Event } from '../event/event'

export interface EmailSender<T> extends Event<T> {
  perform: (data: T) => Promise<void>
}
