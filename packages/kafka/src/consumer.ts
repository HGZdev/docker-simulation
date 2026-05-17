import { subscribe } from "./producer.js";

export const consume = async (topic: string, handler: (message: unknown) => Promise<void>) => {
  console.log(`[kafka] consume ${topic}`);
  subscribe(topic, handler);
};
