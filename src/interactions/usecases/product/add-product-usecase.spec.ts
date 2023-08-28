import { Product } from '@/domain/entities/product'
import { AddProductUseCase } from './add-product-usecase'

describe('AddProduct UseCase', () => {
  it('Should call Product Entity with correct values', async () => {
    const sut = new AddProductUseCase()
    const createSpy = jest.spyOn(Product, 'create')
    await sut.perform({
      name: 'any name',
      amount: 10.90,
      description: 'any description',
      image: 'any image'
    })
    expect(createSpy).toHaveBeenCalledWith({
      name: 'any name',
      amount: 10.90,
      description: 'any description',
      image: 'any image'
    })
  })
})
