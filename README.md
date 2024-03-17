# Spirii

To run:

`npm install`
`npm run start:dev`

## Goals

1. Get aggregated data by user Id: balance, earned, spent, payout, paid out
2. Get list of requested payouts (user ID, payout amount), if there are several

## Pre-conditions:

1. Service will have millions of requests per day
2. Data must be up to date with less than 2 minute’s delay
3. You have limited access to transaction API (5 requests per minute, with limit 1000 transactions)
4. You can use NestJS or any other framework
5. You can mock transaction API entirely so that we can run your app
6. Exchange rate is 1 SCR = 1 EUR

## Transaction API

`GET /transactions?startDate=2023-02-01 00:00:00&endDate=2023-02-01 00:00:00`
Response:

```json
{
  "items": [
    {
      "id": "41bbdf81-735c-4aea-beb3-3e5f433a30c5",
      "userId": "074092",
      "createdAt": "2023-03-16T12:33:11.000Z",
      "type": "payout",
      "amount": 30
    },
    {
      "id": "41bbdf81-735c-4aea-beb3-3e5fasfsdfef",
      "userId": "074092",
      "createdAt": "2023-03-12T12:33:11.000Z",
      "type": "spent",
      "amount": 12
    },
    {
      "id": "41bbdf81-735c-4aea-beb3-342jhj234nj234",
      "userId": "074092",
      "createdAt": "2023-03-15T12:33:11.000Z",
      "type": "earned",
      "amount": 1.2
    }
  ],
  "meta": {
    "totalItems": 1200,
    "itemCount": 3,
    "itemsPerPage": 3,
    "totalPages": 400,
    "currentPage": 1
  }
}
```

## Notes:

- Need readToEnd
- Pre-conditions 1-3 might need cache (implement at last)
- "Exchange rate is 1 SCR = 1 EUR". Uncertain about this. Nothing else points to currencies.
- Seems to be only GET requst in aggregation API
- Using NestJS typescript example project

## Assumptions:

- Assuming Transaction API can't increas page size to higher than 1000
- Assuming Transaction API has no support for filtering on userId or transaction type.
- Assuming Transaction API has support for query ?page=X
- "Task 1: Get aggregated data by user Id: balance, earned, spent, payout, paid out" assuming "payout" and "paid out" is one.
- Task 2: as a first step I'm assuming that the entire liste is expected in response. Not paged.
- Task 2: assuming that the number of payouts is not requested in the response

## TODO/Future improvements
