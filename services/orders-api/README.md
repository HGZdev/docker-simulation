# orders-api

`orders-api` is the write-side HTTP service for order creation and order lookup.

## Responsibility

- accept new orders
- return stored orders
- expose Swagger documentation
- publish order-created events
- expose a health endpoint

## Main Endpoints

- `GET /orders`
- `POST /orders`
- `GET /health`
- `GET /docs`

## Key Files

- `src/app.ts` - Express app and Swagger setup
- `src/features/orders/routes.ts` - HTTP routes for orders
- `src/features/orders/service.ts` - order creation and read logic
- `src/features/health/routes.ts` - health endpoint

## Dependencies

- `@docker-simulation/db`
- `@docker-simulation/kafka`
- `@docker-simulation/shared`
- `express`
- `swagger-jsdoc`
- `swagger-ui-express`

## What To Learn Here

- how a service validates request payloads
- how an API writes data and emits async events
- how Swagger can be used for learning and manual testing

## Run

From the repo root:

```bash
npm run start:orders
```

## Tests

From the repo root:

```bash
npm run test:unit --workspace @docker-simulation/orders-api
```
