import { ObjectId } from 'mongodb'
import { IdMongo } from './id-mongo'

describe('IdMongoBuilder', () => {
  it('Should return an id if build on success', () => {
    const sut = new IdMongo()
    const build = sut.build()
    const pattern = /^[0-9a-fA-F]{24}$/
    expect(pattern.test(build.id)).toBeTruthy()
  })

  it('Should return false if isValid fails', () => {
    const sut = new IdMongo()
    const isValid = sut.isValid('idString')
    expect(isValid).toBe(false)
  })

  it('Should return true if isValid is a success', () => {
    const sut = new IdMongo()
    const isValid = sut.isValid(new ObjectId().toHexString())
    expect(isValid).toBe(true)
  })
})
