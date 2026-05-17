import { prisma } from "@docker-simulation/db";
import { publish, topics } from "@docker-simulation/kafka";
import { createId, ORDER_STATUS, type OrderItem } from "@docker-simulation/shared";

export const createOrder = async (items: OrderItem[]) => {
  const order = await prisma.order.create({
    data: {
      id: createId(),
      status: ORDER_STATUS.NEW,
      items: {
        create: items.map((item) => ({
          id: createId(),
          productId: item.productId,
          quantity: item.quantity
        }))
      }
    },
    include: {
      items: true
    }
  });

  await publish(topics.orderCreated, { orderId: order.id, createdAt: new Date().toISOString() });
  return order;
};

export const listOrders = async () => prisma.order.findMany({
  include: { items: true },
  orderBy: { createdAt: "desc" }
});
