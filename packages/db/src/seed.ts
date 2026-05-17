import { prisma } from "./client.js";

const products = [
  { id: "p-1", name: "Mechanical Keyboard", price: 399, stock: 12 },
  { id: "p-2", name: "USB-C Dock", price: 249, stock: 8 },
  { id: "p-3", name: "4K Monitor", price: 1499, stock: 4 }
];

export const seed = async () => {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();

  await prisma.product.createMany({ data: products });
};

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
