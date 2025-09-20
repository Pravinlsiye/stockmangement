import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { SupplierService } from '../../services/supplier.service';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';
import { Supplier } from '../../models/supplier.model';

@Component({
  selector: 'app-product-list',
  template: `
    <div class="product-list">
      <div class="flex-between mb-20">
        <h1>Products</h1>
        <button class="btn btn-primary" (click)="showAddModal = true">
          <i class="fas fa-plus"></i> Add Product
        </button>
      </div>

      <div class="card">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Purchase Price</th>
              <th>Selling Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let product of paginatedProducts">
              <td>{{ product.name }}</td>
              <td>{{ getCategoryName(product.categoryId) }}</td>
              <td>
                <span [class]="getStockClass(product)">
                  {{ product.currentStock }} {{ product.unit }}
                </span>
              </td>
              <td>₹{{ product.purchasePrice }}</td>
              <td>₹{{ product.sellingPrice }}</td>
              <td>
                <div class="flex">
                  <button class="btn btn-sm btn-primary" (click)="editProduct(product)"><i class="fas fa-edit"></i> Edit</button>
                  <button class="btn btn-sm btn-danger" (click)="deleteProduct(product)"><i class="fas fa-trash"></i> Delete</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        
        <!-- Pagination -->
        <div class="pagination" *ngIf="totalPages > 1">
          <button class="btn btn-sm" (click)="goToPage(currentPage - 1)" [disabled]="currentPage === 1">
            <i class="fas fa-chevron-left"></i> Previous
          </button>
          <span class="page-info">Page {{ currentPage }} of {{ totalPages }}</span>
          <button class="btn btn-sm" (click)="goToPage(currentPage + 1)" [disabled]="currentPage === totalPages">
            Next <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>

      <!-- Add/Edit Product Modal -->
      <div class="modal-backdrop" *ngIf="showAddModal || showEditModal" (click)="closeModal()">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2 class="modal-title">{{ showEditModal ? 'Edit' : 'Add' }} Product</h2>
            <button class="close-btn" (click)="closeModal()">&times;</button>
          </div>
          <form (ngSubmit)="saveProduct()">
            <div class="form-group">
              <label>Name</label>
              <input type="text" class="form-control" [(ngModel)]="currentProduct.name" name="name" required>
            </div>
            <div class="form-group">
              <label>Description</label>
              <textarea class="form-control" [(ngModel)]="currentProduct.description" name="description"></textarea>
            </div>
            <div class="form-group">
              <label>Barcode</label>
              <input type="text" class="form-control" [(ngModel)]="currentProduct.barcode" name="barcode">
            </div>
            <div class="grid grid-2">
              <div class="form-group">
                <label>Category</label>
                <select class="form-control" [(ngModel)]="currentProduct.categoryId" name="categoryId" required>
                  <option value="">Select Category</option>
                  <option *ngFor="let cat of categories" [value]="cat.id">{{ cat.name }}</option>
                </select>
              </div>
              <div class="form-group">
                <label>Supplier</label>
                <select class="form-control" [(ngModel)]="currentProduct.supplierId" name="supplierId" required>
                  <option value="">Select Supplier</option>
                  <option *ngFor="let sup of suppliers" [value]="sup.id">{{ sup.name }}</option>
                </select>
              </div>
            </div>
            <div class="grid grid-2">
              <div class="form-group">
                <label>Purchase Price</label>
                <input type="number" step="0.01" class="form-control" [(ngModel)]="currentProduct.purchasePrice" name="purchasePrice" required>
              </div>
              <div class="form-group">
                <label>Selling Price</label>
                <input type="number" step="0.01" class="form-control" [(ngModel)]="currentProduct.sellingPrice" name="sellingPrice" required>
              </div>
            </div>
            <div class="grid grid-3">
              <div class="form-group">
                <label>Current Stock</label>
                <input type="number" class="form-control" [(ngModel)]="currentProduct.currentStock" name="currentStock" required>
              </div>
              <div class="form-group">
                <label>Min Stock Level</label>
                <input type="number" class="form-control" [(ngModel)]="currentProduct.minStockLevel" name="minStockLevel" required>
              </div>
              <div class="form-group">
                <label>Unit</label>
                <input type="text" class="form-control" [(ngModel)]="currentProduct.unit" name="unit" placeholder="e.g., piece, kg, liter" required>
              </div>
            </div>
            <div class="flex text-right mt-20">
              <button type="button" class="btn" (click)="closeModal()">Cancel</button>
              <button type="submit" class="btn btn-primary">Save</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .product-list h1 {
      margin: 0;
      color: #333;
    }
    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 20px;
      gap: 20px;
    }
    .page-info {
      font-weight: 500;
    }
  `]
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  paginatedProducts: Product[] = [];
  categories: Category[] = [];
  suppliers: Supplier[] = [];
  showAddModal = false;
  showEditModal = false;
  currentProduct: Product = this.initializeProduct();
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 0;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private supplierService: SupplierService
  ) { }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
    this.loadSuppliers();
  }

  initializeProduct(): Product {
    return {
      name: '',
      description: '',
      barcode: '',
      categoryId: '',
      supplierId: '',
      purchasePrice: 0,
      sellingPrice: 0,
      currentStock: 0,
      minStockLevel: 0,
      unit: ''
    };
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe(products => {
      this.products = products;
      this.filteredProducts = products;
      this.updatePagination();
    });
  }
  
  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
    this.goToPage(1);
  }
  
  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    
    this.currentPage = page;
    const startIndex = (page - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedProducts = this.filteredProducts.slice(startIndex, endIndex);
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  loadSuppliers(): void {
    this.supplierService.getAllSuppliers().subscribe(suppliers => {
      this.suppliers = suppliers;
    });
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : '';
  }

  getStockClass(product: Product): string {
    if (product.currentStock <= product.minStockLevel) {
      return 'badge badge-danger';
    } else if (product.currentStock <= product.minStockLevel * 1.5) {
      return 'badge badge-warning';
    }
    return 'badge badge-success';
  }

  editProduct(product: Product): void {
    this.currentProduct = { ...product };
    this.showEditModal = true;
  }

  deleteProduct(product: Product): void {
    if (confirm(`Are you sure you want to delete ${product.name}?`)) {
      this.productService.deleteProduct(product.id!).subscribe(() => {
        this.loadProducts();
      });
    }
  }

  saveProduct(): void {
    if (this.showEditModal) {
      this.productService.updateProduct(this.currentProduct.id!, this.currentProduct).subscribe(() => {
        this.loadProducts();
        this.closeModal();
      });
    } else {
      this.productService.createProduct(this.currentProduct).subscribe(() => {
        this.loadProducts();
        this.closeModal();
      });
    }
  }

  closeModal(): void {
    this.showAddModal = false;
    this.showEditModal = false;
    this.currentProduct = this.initializeProduct();
  }
}
