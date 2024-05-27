import type { Event } from '../event/event'

export type UpdateOrderData = {
  orderId: string
}

export interface UpdateOrder extends Event<UpdateOrderData> {
  perform: (data: UpdateOrderData) => Promise<void>
}
