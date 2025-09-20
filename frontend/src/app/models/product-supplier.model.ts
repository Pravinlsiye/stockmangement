export interface ProductSupplier {
  id?: string;
  productId: string;
  supplierId: string;
  costPerUnit: number;
  deliveryDays: number;
  minimumOrderQuantity: number;
  isPreferred?: boolean;
  notes?: string;
}

export interface ProductSupplierDetails {
  productSupplierId?: string;
  supplierId: string;
  supplierName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  costPerUnit: number;
  deliveryDays: number;
  minimumOrderQuantity: number;
  isPreferred?: boolean;
  notes?: string;
  totalCostForMinOrder?: number;
}
