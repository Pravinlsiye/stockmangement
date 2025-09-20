export interface PurchaseOrder {
  id?: string;
  orderNumber?: string;
  productId: string;
  productName?: string;
  supplierId: string;
  supplierName?: string;
  quantity: number;
  unitPrice: number;
  totalAmount?: number;
  orderDate?: Date | string;
  expectedDeliveryDate: Date | string;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  paymentMethod?: string;
  paymentDate?: Date | string;
  notes?: string;
  createdBy?: string;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PARTIAL = 'PARTIAL',
  PAID = 'PAID',
  REFUNDED = 'REFUNDED'
}

export interface PaymentUpdate {
  status: string;
  paymentMethod: string;
}
