# worker

`worker` is the background processing service for asynchronous order handling.

## Responsibility

- subscribe to order events
- process background work after an order is created
- update order status in the data layer

## Main Flow

1. `orders-api` publishes an event
2. `worker` consumes the event
3. `worker` updates the latest order status

## Key Files

- `src/index.ts` - worker bootstrap
- `src/features/order-processing/consumer.ts` - event subscription logic
- `src/features/order-processing/service.ts` - status update logic

## Dependencies

- `@docker-simulation/db`
- `@docker-simulation/kafka`
- `@docker-simulation/shared`

## What To Learn Here

- how async processing differs from direct HTTP handling
- how a worker is separated from API services
- how event-driven flow fits into a multi-service system

## Run

From the repo root:

```bash
npm run start:worker
```

## Tests

From the repo root:

```bash
npm run test:unit --workspace @docker-simulation/worker
```
