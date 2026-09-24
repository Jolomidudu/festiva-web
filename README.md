# Festiva

Festiva is a modern wedding and event management platform for couples and their guests.

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Lucide React

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Planned backend

The frontend is structured to connect to a separate NestJS API.

Suggested API:

```text
apps/api
  NestJS
  PostgreSQL
  Prisma
  JWT
```

Set the API URL in `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

## Main modules

- Authentication
- Events
- Guests
- Invitations
- RSVPs
- Gift & Wishlist
- Wedding Website
- Vendors
- Notifications
- Settings
