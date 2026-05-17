import { prisma } from "@docker-simulation/db";
import { ORDER_STATUS } from "@docker-simulation/shared";

export const markLatestOrderAsPaid = async () => {
  const order = await prisma.order.findFirst({
    orderBy: { createdAt: "desc" }
  });

  if (!order) {
    return null;
  }

  return prisma.order.update({
    where: { id: order.id },
    data: { status: ORDER_STATUS.PAID },
    include: { items: true }
  });
};
