import { Product, type ProductData } from '@/domain/entities/product'
import { AddProductUseCase } from './add-product-usecase'
import { left } from '@/shared/either'

const makeFakeProductData = (): ProductData => ({
  name: 'any name',
  amount: 10.90,
  description: 'any description'
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

  it('Should return a Error if create Product fails', async () => {
    const { sut } = makeSut()
    jest.spyOn(Product, 'create').mockReturnValueOnce(
      left(new Error('any message'))
    )
    const result = await sut.perform(makeFakeProductData())
    expect(result.value).toEqual(new Error('any message'))
  })
})
