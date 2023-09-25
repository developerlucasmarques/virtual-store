import type { GenerateOrderCode, OrderCode } from '@/domain/usecases-contracts'
import type { Encrypter } from '@/interactions/contracts'

export class GenerateOrderCodeUseCase implements GenerateOrderCode {
  constructor (private readonly encrypter: Encrypter) {}

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
    const { token } = await this.encrypter.encrypt({ value: userId + dateCode.toString() })
    let hex = ''
    for (let i = 0; i < token.length; i++) {
      hex += String(token.charCodeAt(i).toString(16))
    }
    const hashHex = parseInt(hex, 16)
    const range = Math.floor(Math.random() * 3) + 10
    const numberCode = hashHex - (Math.pow(range, 17))
    let stringCode = String(numberCode.toPrecision(35))
    if (stringCode.includes('.')) {
      stringCode = stringCode.replace(/\./g, '')
    }
    const code = this.shuffle(`${stringCode.slice(0, 20)}${dateCode}`)
    return { code: code.slice(0, 7) + '-' + code.slice(7) }
  }
}
