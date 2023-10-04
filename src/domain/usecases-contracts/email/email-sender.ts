import type { Event } from '../event/event'

export type RequiredFieldEmailSender = {
  userEmail: string
  userName: string
  eventType: string
}

export interface EmailSender<T extends RequiredFieldEmailSender> extends Event<T> {
  perform: (data: T) => Promise<void>
}
