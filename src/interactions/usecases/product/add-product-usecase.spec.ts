import { Product, type ProductData } from '@/domain/entities/product'
import { AddProductUseCase } from './add-product-usecase'

const makeFakeProductData = (): ProductData => ({
  name: 'any name',
  amount: 10.90,
  description: 'any description',
  image: 'any image'
})

type SutTypes = {
  sut: AddProductUseCase
}

const makeSut = (): SutTypes => {
  const sut = new AddProductUseCase()
  return { sut }
}

describe('AddProduct UseCase', () => {
  it('Should call Product Entity with correct values', async () => {
    const { sut } = makeSut()
    const createSpy = jest.spyOn(Product, 'create')
    await sut.perform(makeFakeProductData())
    expect(createSpy).toHaveBeenCalledWith(makeFakeProductData())
  })
})
