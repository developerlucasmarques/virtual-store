export class EventNotFoundError extends Error {
  constructor () {
    super('Failed to find event')
    this.name = 'EventNotFoundError'
  }
}
