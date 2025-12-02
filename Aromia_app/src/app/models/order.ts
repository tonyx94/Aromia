export interface OrderItem {
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  status: string;
  totalAmount: number;
  created_at: string;
  order_number: string;

  items?: OrderItem[];
  shippingAddress?: string;
}