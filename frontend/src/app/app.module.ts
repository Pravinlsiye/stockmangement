import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { NgChartsModule } from 'ng2-charts';

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
    ReportsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
