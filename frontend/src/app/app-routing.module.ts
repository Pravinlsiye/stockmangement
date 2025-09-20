import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { CategoryListComponent } from './components/category-list/category-list.component';
import { SupplierListComponent } from './components/supplier-list/supplier-list.component';
import { TransactionListComponent } from './components/transaction-list/transaction-list.component';
import { BillComponent } from './components/bill/bill.component';
import { SalesComponent } from './components/sales/sales.component';
import { SalesBillComponent } from './components/sales-bill/sales-bill.component';
import { ReportsComponent } from './components/reports/reports.component';
import { OrderNowComponent } from './components/order-now/order-now.component';
import { CreateOrderComponent } from './components/create-order/create-order.component';
import { OrdersListComponent } from './components/orders-list/orders-list.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'categories', component: CategoryListComponent },
  { path: 'suppliers', component: SupplierListComponent },
  { path: 'transactions', component: TransactionListComponent },
  { path: 'bill/:id', component: BillComponent },
  { path: 'sales', component: SalesComponent },
  { path: 'sales-bill', component: SalesBillComponent },
  { path: 'reports', component: ReportsComponent },
  { path: 'order-now/:id', component: OrderNowComponent },
  { path: 'create-order', component: CreateOrderComponent },
  { path: 'orders', component: OrdersListComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
