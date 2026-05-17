const subscribers = new Map<string, Array<(message: unknown) => Promise<void>>>();

export const publish = async (topic: string, payload: unknown) => {
  console.log(`[kafka] publish ${topic}`, payload);

  const handlers = subscribers.get(topic) ?? [];
  await Promise.all(handlers.map((handler) => handler(payload)));
};

export const subscribe = (topic: string, handler: (message: unknown) => Promise<void>) => {
  const handlers = subscribers.get(topic) ?? [];
  subscribers.set(topic, [...handlers, handler]);
};

export const resetSubscriptions = () => {
  subscribers.clear();
};
