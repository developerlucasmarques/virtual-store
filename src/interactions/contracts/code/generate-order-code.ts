export type OrderCode = {
  code: string
}

export interface GenerateOrderCode {
  execute: (userId: string) => Promise<OrderCode>
}
