import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __dockerSimulationPrisma__: PrismaClient | undefined;
}

export const prisma = globalThis.__dockerSimulationPrisma__ ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.__dockerSimulationPrisma__ = prisma;
}
