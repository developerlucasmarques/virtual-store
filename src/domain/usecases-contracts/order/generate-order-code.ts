export type OrderCode = {
  code: string
}

export interface GenerateOrderCode {
  perform: (userId: string) => Promise<OrderCode>
}
