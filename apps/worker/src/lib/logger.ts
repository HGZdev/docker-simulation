export const logger = {
  info: (...args: unknown[]) => console.log("[worker]", ...args)
};
