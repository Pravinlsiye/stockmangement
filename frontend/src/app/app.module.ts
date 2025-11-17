import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { NgChartsModule } from 'ng2-charts';
import { AuthInterceptor } from './interceptors/auth.interceptor';

import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { CategoryListComponent } from './components/category-list/category-list.component';
import { SupplierListComponent } from './components/supplier-list/supplier-list.component';
import { TransactionListComponent } from './components/transaction-list/transaction-list.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { BillComponent } from './components/bill/bill.component';
import { SalesComponent } from './components/sales/sales.component';
import { SalesBillComponent } from './components/sales-bill/sales-bill.component';
import { ReportsComponent } from './components/reports/reports.component';
import { OrderNowComponent } from './components/order-now/order-now.component';
import { CreateOrderComponent } from './components/create-order/create-order.component';
import { OrdersListComponent } from './components/orders-list/orders-list.component';
import { NotificationComponent } from './components/notification/notification.component';
import { BillsListComponent } from './components/bills-list/bills-list.component';
import { BillDetailsComponent } from './components/bill-details/bill-details.component';
import { LoginComponent } from './components/login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ProductListComponent,
    CategoryListComponent,
    SupplierListComponent,
    TransactionListComponent,
    NavigationComponent,
    BillComponent,
    SalesComponent,
    SalesBillComponent,
    ReportsComponent,
    OrderNowComponent,
    CreateOrderComponent,
    OrdersListComponent,
    NotificationComponent,
    BillsListComponent,
    BillDetailsComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgChartsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
