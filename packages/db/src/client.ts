import { PrismaClient } from "@prisma/client";
import { testingPrisma } from "./testing-state.js";

declare global {
  // eslint-disable-next-line no-var
  var __dockerSimulationPrisma__: PrismaClient | undefined;
}

export const prisma = process.env.USE_IN_MEMORY_DB === "true"
  ? testingPrisma
  : (globalThis.__dockerSimulationPrisma__ ?? new PrismaClient());

if (process.env.NODE_ENV !== "production" && process.env.USE_IN_MEMORY_DB !== "true") {
  globalThis.__dockerSimulationPrisma__ = prisma;
}
