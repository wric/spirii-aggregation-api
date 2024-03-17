export type Transaction = {
  id: string;
  userId: string;
  createdAt: string;
  type: 'payout' | 'spent' | 'earned'; // TODO: better as enum?
  amount: number;
};

type ResponseMetaData = {
  totalItems: number;
  itemCount: 3;
  itemsPerPage: 3;
  totalPages: 400;
  currentPage: 1;
};

export type TransactionApiResponse = {
  items: Array<Transaction>;
  meta: ResponseMetaData;
};
