// types/orders.ts
export interface OrderItem {
  id: number;
  qty: number;
  unit_price: number;
  subtotal: number;
  book?: {
    id: number;
    title: string;
    isbn: string;
    writer: string;
    category: string;
  };
}

export interface OrderPackage {
  id: number;
  name: string;
  class_count: number | null;
  sessions_count: number | null;
  service_type: string;
}

export interface Order {
  id: number;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  service_type: string;
  status: string;
  payment_status: string;
  total: number | null;
  created_at: string;
  items: OrderItem[];
  package?: OrderPackage;
}

export interface GroupedOrdersResponse {
  data: {
    [key: string]: Order[];
  };
}

export interface SectionData {
  title: string;
  data: Order[];
}