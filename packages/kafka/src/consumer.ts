export const consume = async (topic: string, handler: (message: unknown) => Promise<void>) => {
  console.log(`[kafka] consume ${topic}`);
  await handler({});
};
