# Hanout Direct — B2B FMCG Ordering Pilot

A lightweight Next.js App Router pilot for shop owners ordering FMCG stock from one distributor.

## Included

- Existing catalog, categories, search, cart, reorder, order tracking and history
- French / Arabic toggle with RTL layout
- Shop credit balance on home and checkout
- Delivery settlement: paid in full, partial payment, or added to credit
- Separate ledger payments for old credit
- Distributor Shop Balances screen sorted by highest balance first
- Daily dashboard: orders, order value, outstanding credit
- Order status filtering and shop/order search
- Delivery notes on orders
- Paid / partial / unpaid / credit badges in order history
- Product creation with image upload or image URL
- In/out-of-stock and manual low-stock flags
- Bulk product price/stock/low-stock editing
- Lightweight responsive UI designed for small screens and slower connections
- Abstracted `lib/store.js` data layer
- Next.js API route contracts under `app/api/` for future backend migration

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Distributor password for the pilot: `pilot2026`.

## Data

The current pilot stores its working dataset in browser localStorage so it can run without a database. `lib/store.js` isolates the data operations. The project also includes API route contracts so the same UI model can later be moved to Prisma/Postgres.

For production, replace the local repository with a server-side repository and authentication; do not use the demo admin password.
