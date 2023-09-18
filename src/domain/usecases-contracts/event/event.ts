import type { Either } from '@/shared/either'

export interface Event<T> {
  reqProps: Array<keyof T>
  perform: (data: T) => Promise<Either<Error, null>>
}
