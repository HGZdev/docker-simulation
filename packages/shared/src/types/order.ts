export type OrderItem = {
  productId: string;
  quantity: number;
};

export type Order = {
  id: string;
  status: string;
  items: OrderItem[];
};
