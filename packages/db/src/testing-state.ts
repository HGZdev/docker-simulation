type ProductRecord = {
  id: string;
  name: string;
  price: number;
  stock: number;
};

type OrderItemRecord = {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
};

type OrderRecord = {
  id: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

const defaultProducts: ProductRecord[] = [
  { id: "p-1", name: "Mechanical Keyboard", price: 399, stock: 12 },
  { id: "p-2", name: "USB-C Dock", price: 249, stock: 8 },
  { id: "p-3", name: "4K Monitor", price: 1499, stock: 4 }
];

const state = {
  products: [...defaultProducts],
  orders: [] as OrderRecord[],
  orderItems: [] as OrderItemRecord[]
};

export const resetTestingState = () => {
  state.products = [...defaultProducts];
  state.orders = [];
  state.orderItems = [];
};

export const testingPrisma = {
  product: {
    findMany: async () => [...state.products]
  },
  order: {
    create: async ({ data, include }: { data: { id: string; status: string; items: { create: OrderItemRecord[] } }; include?: { items?: boolean } }) => {
      const now = new Date();
      const order: OrderRecord = {
        id: data.id,
        status: data.status,
        createdAt: now,
        updatedAt: now
      };

      state.orders.push(order);
      const items = data.items.create.map((item) => ({ ...item, orderId: order.id }));
      state.orderItems.push(...items);

      return include?.items ? { ...order, items } : order;
    },
    findMany: async ({ include }: { include?: { items?: boolean }; orderBy?: { createdAt: "desc" | "asc" } } = {}) => {
      const orders = [...state.orders].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      return orders.map((order) => ({
        ...order,
        ...(include?.items
          ? { items: state.orderItems.filter((item) => item.orderId === order.id) }
          : {})
      }));
    },
    findFirst: async () => {
      const order = [...state.orders].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];
      return order ?? null;
    },
    update: async ({ where, data, include }: { where: { id: string }; data: { status: string }; include?: { items?: boolean } }) => {
      const order = state.orders.find((entry) => entry.id === where.id);
      if (!order) {
        throw new Error("Order not found");
      }

      order.status = data.status;
      order.updatedAt = new Date();

      return {
        ...order,
        ...(include?.items
          ? { items: state.orderItems.filter((item) => item.orderId === order.id) }
          : {})
      };
    },
    deleteMany: async () => {
      state.orders = [];
    }
  },
  orderItem: {
    deleteMany: async () => {
      state.orderItems = [];
    }
  }
};
