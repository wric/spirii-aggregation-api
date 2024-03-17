import { Injectable } from '@nestjs/common';
import { UserAggregate } from 'types/UserAggregate';
import { TransactionApiResponse } from 'types/TransactionApi';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getUserAggregate(userId: string): UserAggregate {
    let aggregate: UserAggregate = {
      userId: userId,
      balance: 0,
      earned: 0,
      spent: 0,
      payout: 0,
    };

    // TODO: improve perf with with index of array
    for (const transaction of mockResUsers.items) {
      if (transaction.userId !== userId) {
        continue;
      }

      switch (transaction.type) {
        case 'earned':
          aggregate.earned += transaction.amount;
          aggregate.balance += transaction.amount;
          break;

        case 'spent':
          aggregate.spent += transaction.amount;
          aggregate.balance -= transaction.amount;
          break;

        case 'payout':
          aggregate.payout += transaction.amount;
          aggregate.balance -= transaction.amount;
      }
    }

    return aggregate;
  }
}

const mockResUsers: TransactionApiResponse = {
  items: [
    {
      id: '41bbdf81-735c-4aea-beb3-3e5f433a30c5',
      userId: '074092',
      createdAt: '2023-03-16T12:33:11.000Z',
      type: 'payout',
      amount: 30,
    },
    {
      id: '41bbdf81-735c-4aea-beb3-3e5fasfsdfef',
      userId: '074092',
      createdAt: '2023-03-12T12:33:11.000Z',
      type: 'spent',
      amount: 12,
    },
    {
      id: '41bbdf81-735c-4aea-beb3-342jhj234nj234',
      userId: '074092',
      createdAt: '2023-03-15T12:33:11.000Z',
      type: 'earned',
      amount: 1.2,
    },
  ],
  meta: {
    totalItems: 1200,
    itemCount: 3,
    itemsPerPage: 3,
    totalPages: 400,
    currentPage: 1,
  },
};
