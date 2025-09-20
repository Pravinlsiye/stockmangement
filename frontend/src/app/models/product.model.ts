export interface Product {
  id?: string;
  name: string;
  description: string;
  barcode: string;
  categoryId: string;
  supplierId: string;
  purchasePrice: number;
  sellingPrice: number;
  currentStock: number;
  minStockLevel: number;
  unit: string;
  createdAt?: Date;
  updatedAt?: Date;
}
