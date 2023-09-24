import type { CreateOrderCode, OrderCode } from '@/domain/usecases-contracts'
import crypto from 'crypto'

export class CreateOrderCodeUseCase implements CreateOrderCode {
  private generateRandom (): number {
    const random = Math.random() * Math.random()
    const randomString = random.toString().split('.')[1]
    let sum = 1
    for (let i = 0; i < 4; i++) {
      sum += Number(randomString.split('')[i])
    }
    return sum
  }

  private shuffle (characters: string): string {
    const charArray = characters.split('')
    for (let i = charArray.length - 1; i > 0; i--) {
      const x = Math.floor(Math.random() * (i + 1));
      [charArray[i], charArray[x]] = [charArray[x], charArray[i]]
    }
    return charArray.join('').slice(0, 14)
  }

  async perform (userId: string): Promise<OrderCode> {
    const dateCode = Math.floor(new Date().getTime() / this.generateRandom())
    const hash = crypto.createHash('md5').update(userId + dateCode.toString()).digest('hex')
    const resultingNumber = parseInt(hash, 16)
    const numberCode = resultingNumber / (Math.pow(11, 17) - this.generateRandom())
    const stringCode = String(Math.round(numberCode))
    const chars = this.shuffle(`${stringCode.slice(0, 17)}${dateCode}`)
    const part1 = chars.slice(0, 7)
    const part2 = chars.slice(7)
    return { code: part1 + '-' + part2 }
  }
}
