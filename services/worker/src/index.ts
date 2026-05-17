import { startConsumer } from "./features/order-processing/consumer.js";
import { logger } from "./lib/logger.js";

startConsumer().then(() => {
  logger.info("consumer started");
});
