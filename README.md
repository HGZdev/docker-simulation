# Docker Simulation Store

A small online store demo for learning Docker, `hybrid microservices`, and asynchronous communication with `Kafka`.

## Stack

- Node.js 22
- TypeScript
- Express
- Swagger UI
- PostgreSQL
- Kafka
- Vitest
- Docker Compose

## MVP Services

- `catalog-api` - product listing and stock availability
- `orders-api` - order creation and order status lookup
- `worker` - background order event processing
- `postgres`
- `kafka`

## Run Locally Without Docker

```bash
npm install
npm run prisma:generate --workspace @docker-simulation/db
npm run prisma:push --workspace @docker-simulation/db
npm run prisma:seed --workspace @docker-simulation/db
npm run start:catalog
npm run start:orders
npm run start:worker
```

## Run With Docker Compose

```bash
docker compose up --build
```

## Endpoints

- `http://localhost:3001/products`
- `http://localhost:3001/health`
- `http://localhost:3002/orders`
- `http://localhost:3002/health`
- `http://localhost:3002/docs`

## Tests

```bash
npm run test:unit
npm run test:integration
npm run test:e2e
```

## Notes

- The frontend is prepared as stage 2 in the `frontend/` directory.
- Observability with `Grafana + Loki + Prometheus` is planned as a later stage.
- The data layer runs through `Prisma + PostgreSQL`; unit tests mock the Prisma client.
