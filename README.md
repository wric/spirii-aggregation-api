# Spirii

To run:

`npm install`

`npm run start`

Test with:

`http://localhost:3000/api/v1/users/074092?startDate=2023-03-01&endDate=2023-03-31`

`http://localhost:3000/api/v1/payouts?startDate=2023-03-01&endDate=2023-03-31`

#### Known limitations:

- Error handling with proper error messages and status codes are not implemented.
- The mocked Transaction API doesn't work (pagination, bad mock data, etc)
- Throttle 5 req/min was not finnished (plan was to use [p-throttle](https://www.npmjs.com/package/p-throttle) that I have used previously with success).
- Cache to handle all request (max 2 min old data) is not implemented. Plan was to use p-throttle similar [p-memoize](https://github.com/sindresorhus/p-memoize), due to similarity in api.
- Tests are broken.

#### Testing approach:

In hindsight, I should have created a much better mock data that simulates the cases asked for in the tasks. Then, before writing the code, create the test cases for the main flows and request. These should act as my target. Along the way as I found find special cases and new boundariece that are not easily understood from just the task description i would add a test for it. At this point it doesnt event need to run, just the name of the test (that should always describe the testa case as clear as possible) i enought. I prefer not to jump on each edge case test right away, instead focus on the main task/flows. The main tests guides the development, and help to focus on the larger task. The edge cases are first handled when the main cases are done. As NestJS is new to me, I prioritized to get something up and running in this limited time, instead of test coverage.

We should also not only add test for the happy path. But in a MVP it's important to balance and prioritize the test efforts. With focus on good error handling with error messages, logging, etc, you can help the consumer of the API to understand the issue.

Consuming an external API (as with the transactions) brings some challenges. We don't own it, but we depend on it. Our api will fail if that API goes down, or changes behaivors. Might not be a part of TDD, but important to consider, and mayby add som end to end test. Also, an API with large number of requests will probably grow quickly in data size and get to volumes that are not easily tested. Some load testing is always good for QA.

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
- Task 2: as a first step I'm assuming that the entire lise is expected in response. Not paged.
- Task 2: assuming that the number of payouts is not requested in the response

## TODO/Future improvements
