export interface StockLevel {
  sku: string;
  onHand: number;
  reserved: number;
  updatedAt: string;
}

export interface OrderLine {
  sku: string;
  quantity: number;
}

export interface Order {
  id: string;
  lines: OrderLine[];
}
