import type { FormatEmail } from '@/domain/application-contracts'
import type { EmailSender } from '@/domain/usecases-contracts'

export type KeysOf<T> = keyof T

export class EmailSenderUseCase<T> implements EmailSender<T> {
  requiredProps: Array<KeysOf<T>> = []

  constructor (private readonly formatEmail: FormatEmail<T>) {}

  async perform (data: T): Promise<void> {
    await this.formatEmail.execute(data)
  }
}
