import type { CartModel, ProductModel } from '@/domain/models'
import type { CalculateCartData } from './contracts/calculation-cart-total'
import { CalculateCartTotal } from './calculate-total'

const makeFakeCartModel = (): CartModel => ({
  id: 'any_id',
  userId: 'any_user_id',
  products: [{
    id: 'any_product_id_1',
    quantity: 1
  }, {
    id: 'any_product_id_2',
    quantity: 2
  }, {
    id: 'any_product_id_3',
    quantity: 3
  }]
})

const makeFakeProducts = (): ProductModel[] => [{
  id: 'any_product_id_1',
  name: 'any name',
  amount: 10.90,
  description: 'any description'
}, {
  id: 'any_product_id_2',
  name: 'any name 2',
  amount: 20.90,
  description: 'another description'
}, {
  id: 'any_product_id_3',
  name: 'any name 3',
  amount: 32.99,
  description: 'another description'
}]

const makeFakeCalculateCartData = (): CalculateCartData => ({
  cartModel: makeFakeCartModel(),
  products: makeFakeProducts()
})

describe('CalculateCartTotal', () => {
  it('Should return Total on success', async () => {
    const sut = new CalculateCartTotal()
    const result = sut.execute(makeFakeCalculateCartData())
    expect(result).toEqual({ total: 151.67 })
  })
})
