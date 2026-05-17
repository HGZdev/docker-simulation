import { prisma } from "@docker-simulation/db";

export const listProducts = async () => prisma.product.findMany({
  orderBy: { name: "asc" }
});
