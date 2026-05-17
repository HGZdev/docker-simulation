export const env = {
  port: Number(process.env.ORDERS_API_PORT ?? 3002),
  swaggerServerUrl: process.env.SWAGGER_SERVER_URL ?? "http://localhost:3002"
};
