# catalog-api

`catalog-api` is the read-side service for the store catalog.

## Responsibility

- return the product list
- expose stock availability
- expose a simple health endpoint

## Main Endpoints

- `GET /products`
- `GET /health`

## Key Files

- `src/app.ts` - Express app setup
- `src/features/catalog/routes.ts` - HTTP routes for catalog
- `src/features/catalog/service.ts` - product read logic
- `src/features/health/routes.ts` - health endpoint

## Dependencies

- `@docker-simulation/db`
- `@docker-simulation/shared`
- `express`

## What To Learn Here

- how a small HTTP service is structured
- how a service reads from the shared database layer
- how feature-based organization looks in practice

## Run

From the repo root:

```bash
npm run start:catalog
```

## Tests

From the repo root:

```bash
npm run test:unit --workspace @docker-simulation/catalog-api
```
