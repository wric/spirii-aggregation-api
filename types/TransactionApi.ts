export type Transaction = {
  id: string;
  userId: string;
  createdAt: string;
  type: 'payout' | 'spent' | 'earned'; // TODO: better as enum?
  amount: number;
};

type ResponseMetaData = {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
};

export type TransactionApiResponse = {
  items: Array<Transaction>;
  meta: ResponseMetaData;
};
