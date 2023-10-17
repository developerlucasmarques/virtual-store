import { FormatCheckoutCompletedEmailApplication } from './format-email-checkout-completed'

type FormatEmailProduct = {
  name: string
  amount: number
  quantity: number
}

type FormatEmailData = {
  userName: string
  orderCode: string
  products: FormatEmailProduct[]
}

const makeFakeFormatEmailData = (): FormatEmailData => ({
  userName: 'any_user_name',
  orderCode: 'any_order_code',
  products: [{
    name: 'any_product',
    amount: 10.90,
    quantity: 2
  }, {
    name: 'another_product',
    amount: 12.90,
    quantity: 1
  }]
})

type SutTypes = {
  sut: FormatCheckoutCompletedEmailApplication
}

const makeSut = (): SutTypes => {
  const sut = new FormatCheckoutCompletedEmailApplication()
  return { sut }
}

describe('FormatCheckoutCompletedEmail Application', () => {
  it('Should return formated email with correct values', async () => {
    const { sut } = makeSut()
    const result = sut.execute(makeFakeFormatEmailData())
    expect(result.html).toContain('any_user_name')
    expect(result.html).toContain('any_order_code')
    expect(result.html).toContain('2 any_product 10.90')
    expect(result.html).toContain('1 another_product 12.90')
  })
})
