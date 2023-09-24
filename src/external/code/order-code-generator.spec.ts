import { OrderCodeGenerator } from './order-code-generator'

const id = 'any_user_id_1234'

describe('OrderCodeGenerator', () => {
  it('Should code with 15 characters', async () => {
    const sut = new OrderCodeGenerator()
    const result = await sut.execute(id)
    expect(result.code.length).toBe(15)
  })

  it('Should return only numbers in each part', async () => {
    const sut = new OrderCodeGenerator()
    const result = await sut.execute(id)
    const part1 = result.code.slice(0, 7)
    const part2 = result.code.slice(8)
    const test1 = /^[0-9]+$/.test(part1)
    const test2 = /^[0-9]+$/.test(part2)
    expect(test1).toBe(true)
    expect(test2).toBe(true)
  })
})
