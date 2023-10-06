# Musictracker

## Project structure

- `src/client/` - React client code
- `src/server/` - Expressjs server code
- `src/contract.ts` - contract between server and client
- `public/` - static files
- `drizzle/` - db migrations

## Setup

```bash
npm install # install project dependencies
npm run migrate # run database migrations
npm run dev # start vite dev server and expressjs server
```
