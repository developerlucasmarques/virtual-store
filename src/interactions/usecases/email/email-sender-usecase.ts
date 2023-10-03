import type { FormatEmail } from '@/domain/application-contracts'
import type { EmailSender } from '@/domain/usecases-contracts'

export class EmailSenderUseCase<T> implements EmailSender<T> {
  constructor (
    public readonly requiredProps: Array<keyof T>,
    private readonly formatEmail: FormatEmail<T>
  ) {}

  async perform (data: T): Promise<void> {
    await this.formatEmail.execute(data)
  }
}
