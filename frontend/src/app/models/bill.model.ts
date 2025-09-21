export interface Bill {
    billId: string;
    billDate: Date;
    totalItems: number;
    totalAmount: number;
    items?: BillItem[];
}

export interface BillItem {
    productId: string;
    productName: string;
    productCode: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}
