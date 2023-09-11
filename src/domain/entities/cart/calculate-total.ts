import type { ProductCartData } from '@/domain/models'
import type { CalculateCartData, CalculattionCartTotal, Total } from './contracts/calculation-cart-total'

export class CalculateCartTotal implements CalculattionCartTotal {
  execute (data: CalculateCartData): Total {
    const { cartModel, products } = data
    const productsCart: ProductCartData[] = products.map(
      ({ description, ...rest }) => ({ ...rest, quantity: 0 })
    )
    for (let i = 0; i < productsCart.length; i++) {
      cartModel.products.forEach((product) => {
        if (product.id === productsCart[i].id) {
          productsCart[i].quantity = product.quantity
        }
      })
    }
    let total = 0
    productsCart.forEach((product) => { total += product.amount * product.quantity })
    return { total }
  }
}
