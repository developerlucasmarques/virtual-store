export type OrderCode = {
  code: string
}

export interface CreateOrderCode {
  perform: (userId: string) => Promise<OrderCode>
}
