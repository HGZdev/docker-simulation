import { consume } from "@docker-simulation/kafka";
import { env } from "../../config/env.js";
import { logger } from "../../lib/logger.js";
import { markLatestOrderAsPaid } from "./service.js";

export const startConsumer = async () => {
  await consume(env.consumerTopic, async () => {
    const order = await markLatestOrderAsPaid();
    logger.info("processed order", order?.id);
  });
};
