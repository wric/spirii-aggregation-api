import { Injectable } from '@nestjs/common';
import { Payout } from 'types/Payout';
import { Transaction, TransactionApiResponse } from 'types/TransactionApi';
import { UserAggregate } from 'types/UserAggregate';
import { mockTransactionResponse } from './mockData';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async getUserAggregateById(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<UserAggregate> {
    const transactions = await this.getTransactions(startDate, endDate);
    const aggregate: UserAggregate = {
      userId: null,
      balance: 0,
      earned: 0,
      spent: 0,
      payout: 0,
    };

    // TODO: could improve perf with with index of array
    for (const transaction of transactions) {
      if (transaction.userId !== userId) {
        continue;
      }

      aggregate.userId = transaction.userId;

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

  async getPayouts(startDate: Date, endDate: Date): Promise<Array<Payout>> {
    const transactions = await this.getTransactions(startDate, endDate);
    const userPayouts: { [userId: string]: number } = {};

    for (const transaction of transactions) {
      if (transaction.type !== 'payout') {
        continue;
      }

      if (typeof userPayouts[transaction.userId] !== 'string') {
        userPayouts[transaction.userId] = transaction.amount;
      } else {
        userPayouts[transaction.userId] += transaction.amount;
      }
    }

    const payouts = Object.entries(userPayouts).map(([userId, payout]) => {
      return { userId, payout };
    });

    return payouts;
  }

  async getTransactions(
    startDate: Date,
    endDate: Date,
  ): Promise<Array<Transaction>> {
    const apiPath =
      '/transactions?' +
      `?startDate=${startDate.toISOString().replace('T', ' ').substring(0, 19)}` +
      `?endDate=${endDate.toISOString().replace('T', ' ').substring(0, 19)}` +
      '&limit=1000';

    const firstPage = await this.apiFetch(apiPath);
    const allTransactions = firstPage.items;

    const pagesPromises: Array<Promise<TransactionApiResponse>> = [];
    for (let page = 2; page <= firstPage.meta.totalPages; page++) {
      pagesPromises.push(this.apiFetch(apiPath + `&page=${page}`));
    }

    const pages = await Promise.all(pagesPromises);
    for (const page of pages) {
      allTransactions.push(...page.items);
    }

    // return allTransactions;
    // Mock filtering on date here for simplicity
    return allTransactions.filter((transaction) => {
      const transactionDate = new Date(transaction.createdAt);
      return transactionDate > startDate && transactionDate < endDate;
    });
  }

  async apiFetch(_: string) {
    return mockTransactionResponse;
  }
}
