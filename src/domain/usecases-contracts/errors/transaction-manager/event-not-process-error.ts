export class EventNotProcessError extends Error {
  constructor (eventName: string) {
    super(`Event with name '${eventName}' not process`)
    this.name = 'EventNotProcessError'
  }
}
