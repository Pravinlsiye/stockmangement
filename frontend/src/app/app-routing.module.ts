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
import { BillsListComponent } from './components/bills-list/bills-list.component';
import { BillDetailsComponent } from './components/bill-details/bill-details.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'products', component: ProductListComponent, canActivate: [AuthGuard] },
  { path: 'categories', component: CategoryListComponent, canActivate: [AuthGuard] },
  { path: 'suppliers', component: SupplierListComponent, canActivate: [AuthGuard] },
  { path: 'transactions', component: TransactionListComponent, canActivate: [AuthGuard] },
  { path: 'bill/:id', component: BillComponent, canActivate: [AuthGuard] },
  { path: 'sales', component: SalesComponent, canActivate: [AuthGuard] },
  { path: 'sales-bill', component: SalesBillComponent, canActivate: [AuthGuard] },
  { path: 'bills', component: BillsListComponent, canActivate: [AuthGuard] },
  { path: 'bills/:id', component: BillDetailsComponent, canActivate: [AuthGuard] },
  { path: 'reports', component: ReportsComponent, canActivate: [AuthGuard] },
  { path: 'order-now/:id', component: OrderNowComponent, canActivate: [AuthGuard] },
  { path: 'create-order', component: CreateOrderComponent, canActivate: [AuthGuard] },
  { path: 'orders', component: OrdersListComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
