import type { Event, TransactionEventType } from '@/domain/usecases-contracts'
import { EventManagerUseCase } from '@/interactions/usecases/event-manager'
import { makeTransactioManagerUseCase } from './transaction-manager-usecase-factory'
import { makeUpdateOrderUseCase } from '../order'

jest.mock('@/interactions/usecases/event-manager/event-manager-usecase')

type EventConfig = { [key in TransactionEventType]: Array<Event<any>> }

describe('TransactioManagerUseCase Factory', () => {
  it('Should call EventManagerUseCase with correct events', () => {
    makeTransactioManagerUseCase()
    const eventConfig: EventConfig = {
      CheckoutCompleted: [
        makeUpdateOrderUseCase({ status: 'Processing', paymentStatus: 'Payment_Pending' })
      ],
      PaymentSuccess: [],
      PaymentFailure: []
    }
    expect(EventManagerUseCase).toHaveBeenCalledWith(eventConfig)
  })
})
