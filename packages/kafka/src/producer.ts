export const publish = async (topic: string, payload: unknown) => {
  console.log(`[kafka] publish ${topic}`, payload);
};
