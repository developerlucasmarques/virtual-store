import type { CartModel, CompleteCartModel, ProductModel } from '@/domain/models'
import type { CreateCartData } from './contracts/creation-cart'
import { Cart } from './cart'

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

const makeFakeCartWithTotalModel = (): CompleteCartModel => ({
  total: 151.67,
  products: [{
    id: 'any_product_id_1',
    name: 'any name',
    amount: 10.90,
    quantity: 1
  }, {
    id: 'any_product_id_2',
    name: 'any name 2',
    amount: 20.90,
    quantity: 2
  }, {
    id: 'any_product_id_3',
    name: 'any name 3',
    amount: 32.99,
    quantity: 3
  }]
})

const makeFakeCreateCartData = (): CreateCartData => ({
  cartModel: makeFakeCartModel(),
  products: makeFakeProducts()
})

describe('Cart Entity', () => {
  it('Should return CompleteCartModel on success', async () => {
    const sut = new Cart()
    const result = sut.execute(makeFakeCreateCartData())
    expect(result).toEqual(makeFakeCartWithTotalModel())
  })
})
