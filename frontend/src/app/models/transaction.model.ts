export interface Transaction {
  id?: string;
  productId: string;
  type: TransactionType;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  reference: string;
  billId?: string;
  notes: string;
  transactionDate?: Date;
}

export enum TransactionType {
  PURCHASE = 'PURCHASE',
  SALE = 'SALE',
  ADJUSTMENT = 'ADJUSTMENT'
}
