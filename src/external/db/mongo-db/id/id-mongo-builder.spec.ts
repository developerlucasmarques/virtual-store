import { IdMongoBuilder } from './id-mongo-builder'

describe('IdMongoBuilder', () => {
  it('Should return an id if build on success', () => {
    const sut = new IdMongoBuilder()
    const build = sut.build()
    const pattern = /^[0-9a-fA-F]{24}$/
    expect(pattern.test(build.id)).toBeTruthy()
  })
})
