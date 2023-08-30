import { IdMongo } from './id-mongo'

describe('IdMongoBuilder', () => {
  it('Should return an id if build on success', () => {
    const sut = new IdMongo()
    const build = sut.build()
    const pattern = /^[0-9a-fA-F]{24}$/
    expect(pattern.test(build.id)).toBeTruthy()
  })
})
