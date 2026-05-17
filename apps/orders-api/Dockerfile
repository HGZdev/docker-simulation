FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
COPY apps/orders-api/package.json ./apps/orders-api/package.json
COPY packages/db/package.json ./packages/db/package.json
COPY packages/kafka/package.json ./packages/kafka/package.json
COPY packages/shared/package.json ./packages/shared/package.json
RUN npm install
COPY . .
CMD ["npm", "run", "start:orders"]
