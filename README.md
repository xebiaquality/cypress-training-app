# Musictracker

## Running the app

### Running the app (frontend and backend)

to run the frontend and backend together, you need to run the following command:

```bash
npm run dev
```

### Running the Frontend in isolation

to run the frontend in isolation, you need to run the following command:

```bash
ISOLATION='frontend' npm run dev
```

### Running the Backend in isolation

to run the backend in isolation, you need to run the following command:

```bash
ISOLATION='backend' npm run dev
```

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
