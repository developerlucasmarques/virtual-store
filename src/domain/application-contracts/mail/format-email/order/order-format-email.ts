import type { ProductCartData } from '@/domain/models'
import type { FormatEmail, FormatEmailResponse } from '../generic/format-email'

export type OrderFormatEmailProduct = Omit<ProductCartData, 'id'>

export type OrderFormatEmailData = {
  userName: string
  orderCode: string
  products: OrderFormatEmailProduct[]
}

export interface OrderFormatEmail extends FormatEmail<OrderFormatEmailData> {
  execute: (data: OrderFormatEmailData) => FormatEmailResponse
}
