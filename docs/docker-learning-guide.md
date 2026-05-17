# Docker Learning Guide

This project is designed as a hands-on playground for learning:

- Docker basics
- multi-container applications
- service boundaries
- local infrastructure
- how APIs, a database, and async processing fit together

## What You Are Looking At

The project is split into a few main parts:

- `services/catalog-api`
  - returns products and stock
- `services/orders-api`
  - accepts orders and exposes Swagger docs
- `services/worker`
  - simulates background processing of order events
- `packages/db`
  - Prisma + PostgreSQL data layer
- `packages/kafka`
  - Kafka integration layer, currently still simple
- `packages/shared`
  - shared types, schemas, and constants
- `frontend/`
  - reserved for stage 2
- `docker-compose.yml`
  - the main local orchestration entry point

This is a `hybrid microservices` learning setup:

- synchronous communication through HTTP
- asynchronous processing through Kafka-style events
- shared PostgreSQL in the current MVP

## What To Learn First

Do not try to learn everything at once.

Recommended order:

1. Learn what each service does
2. Learn how Docker Compose starts multiple services together
3. Learn how services talk to each other
4. Learn how data is persisted in PostgreSQL
5. Learn how async processing is different from direct HTTP calls
6. Learn how logs help you understand the system

## Before You Start

You should have:

- Docker Desktop or a working Docker Engine
- Node.js 22
- npm

Useful commands to check locally:

```bash
docker --version
docker compose version
node --version
npm --version
```

## Main Ways To Run The Project

There are two useful learning modes.

### 1. Run Everything With Docker Compose

This is the best mode for learning Docker.

```bash
docker compose up --build
```

What this teaches you:

- how multiple containers start together
- how ports are exposed
- how environment variables are passed in
- how service names become internal hostnames
- how infrastructure like Postgres and Kafka sit next to your app services

### 2. Run Services Locally Without Docker

This is useful when you want to debug code faster.

```bash
npm install
npm run prisma:generate --workspace @docker-simulation/db
npm run prisma:push --workspace @docker-simulation/db
npm run prisma:seed --workspace @docker-simulation/db
npm run start:catalog
npm run start:orders
npm run start:worker
```

What this teaches you:

- which parts are app code vs infrastructure
- which services depend on the database
- how local development differs from containerized development

## First Practical Learning Session

Use this exact sequence.

### Step 1. Read The Compose File

Open:

- `docker-compose.yml`

Look for:

- service names
- ports
- environment variables
- `depends_on`
- volumes
- commands

Questions to ask yourself:

- Which services are app services?
- Which services are infrastructure?
- Which ports are for your browser?
- Which hostnames are only internal to Docker?

### Step 2. Start The Stack

```bash
docker compose up --build
```

Watch the logs.

Pay attention to:

- which container starts first
- whether Postgres is ready before app services try to use it
- whether Prisma setup runs successfully
- whether app services listen on expected ports

### Step 3. Inspect Running Containers

In another terminal:

```bash
docker compose ps
```

This teaches you:

- container state
- exposed ports
- service naming

### Step 4. Call The APIs

Use these endpoints:

- `http://localhost:3001/products`
- `http://localhost:3001/health`
- `http://localhost:3002/orders`
- `http://localhost:3002/health`
- `http://localhost:3002/docs`

Start with:

```bash
curl http://localhost:3001/products
curl http://localhost:3002/health
```

Then create an order:

```bash
curl -X POST http://localhost:3002/orders \
  -H "Content-Type: application/json" \
  -d '{"items":[{"productId":"p-1","quantity":1}]}'
```

What to observe:

- request goes to `orders-api`
- order is saved in the database
- an async event is published
- worker processes the event and updates status

### Step 5. Watch Logs While Calling The App

```bash
docker compose logs -f
```

Better, inspect one service at a time:

```bash
docker compose logs -f orders-api
docker compose logs -f worker
docker compose logs -f postgres
```

This teaches you:

- how logs are your first debugging tool
- how to correlate a request with background processing
- how to spot failures between services

## What To Pay Attention To

### 1. Container Boundaries

Each service should have one clear responsibility.

Learn to ask:

- why is this a separate container?
- what does it own?
- what does it depend on?

### 2. Internal Networking

Inside Docker Compose, services talk to each other by service name.

Example:

- `postgres` is reachable as `postgres`
- `kafka` is reachable as `kafka`

That is different from using `localhost`.

Important rule:

- from your machine: use `localhost:port`
- from one container to another: use `service-name:port`

### 3. Environment Variables

Check how config is injected.

Important examples:

- `DATABASE_URL`
- `CATALOG_API_PORT`
- `ORDERS_API_PORT`
- `SWAGGER_SERVER_URL`

Learn to understand:

- which variables belong to app code
- which variables belong to infrastructure
- how bad config usually breaks startup

### 4. Volumes And Persistence

Postgres uses a Docker volume.

That means:

- data can survive container restarts
- deleting the container is not the same as deleting the data

To reset everything:

```bash
docker compose down -v
```

This teaches you the difference between:

- container lifecycle
- persistent data lifecycle

### 5. Build vs Run

A very important Docker lesson:

- `build` creates images
- `run` starts containers from images

Use:

```bash
docker compose up --build
```

Then change code and think about:

- did I change source code only?
- did I change dependencies?
- do I need to rebuild?

## Suggested Exercises

### Exercise 1. Trace A Single Request

Goal:

- understand request flow end to end

Do:

1. start the stack
2. call `POST /orders`
3. watch `orders-api` logs
4. watch `worker` logs
5. query `GET /orders`

Learn:

- sync + async flow in one system

### Exercise 2. Break The Database Connection

Goal:

- understand failure modes

Do:

1. stop `postgres`
2. call an endpoint that needs data
3. inspect logs

Learn:

- how dependent services fail
- what healthy startup order means

### Exercise 3. Reset Everything

Goal:

- understand stateless vs stateful parts

Do:

```bash
docker compose down
docker compose up --build
docker compose down -v
docker compose up --build
```

Learn:

- difference between restarting containers and wiping data

### Exercise 4. Explore Swagger

Goal:

- use API docs as a backend learning tool

Do:

1. open `http://localhost:3002/docs`
2. inspect available endpoints
3. send requests from the UI

Learn:

- how API docs help validate backend behavior

## Useful Commands During Learning

Start the stack:

```bash
docker compose up --build
```

Run in background:

```bash
docker compose up -d --build
```

See running services:

```bash
docker compose ps
```

See all logs:

```bash
docker compose logs -f
```

See one service logs:

```bash
docker compose logs -f orders-api
```

Stop everything:

```bash
docker compose down
```

Stop and remove volumes:

```bash
docker compose down -v
```

## How To Read This Repository

Use this order:

1. `README.md`
2. `docker-compose.yml`
3. `services/orders-api/src/app.ts`
4. `services/orders-api/src/features/orders/`
5. `services/worker/src/features/order-processing/`
6. `packages/db/prisma/schema.prisma`
7. `packages/shared/src/`

Why this order:

- first understand runtime
- then understand entry points
- then understand business flow
- then understand storage

## Things That Are Still Intentionally Simple

This project is educational, so some parts are still simplified:

- Kafka integration is still lightweight
- frontend is not yet the main UI
- observability stack is planned for later
- some tests are still starter-level scaffolding

That is fine.

The goal is not to impress with complexity.
The goal is to understand how the pieces fit together.

## Best Learning Mindset

When working with this repo, keep asking:

- What runs in a container?
- What depends on what?
- Which failures happen at startup?
- Which failures happen at runtime?
- Which data is persistent?
- Which communication is sync?
- Which communication is async?

If you can answer those questions after using this project, you are learning the right things.
