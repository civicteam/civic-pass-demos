# This is a tiny demo app showing Civic Pass integration with Next 14.

## Getting Started

Install dependencies and run the development server:

```bash
bun install
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Offline Payer

This demo shows an example of how to pay for your users' Civic Pass using an offline payer.

This allows you to onboard users that do not have a cryptocurrency balance, perfect for cases where wallets
are provisioned for the user, among other case.

See the sample frontend code in `src/app/components/CivicPassProvider.tsx`,
and the sample backend code in `src/app/api/route.ts`.

## Learn More

Find out more about what you can do with Civic Pass at [civic.com](https://www.civic.com/).

See docs at [https://docs.civic.com/](https://docs.civic.com/).
