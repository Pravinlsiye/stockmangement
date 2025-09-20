import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { SupplierService } from '../../services/supplier.service';
import { ProductSupplierService } from '../../services/product-supplier.service';
import { NotificationService } from '../../services/notification.service';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';
import { Supplier } from '../../models/supplier.model';
import { ProductSupplier } from '../../models/product-supplier.model';

@Component({
  selector: 'app-product-list',
  template: `
    <div class="product-list">
      <div class="flex-between mb-20">
        <h1>Products</h1>
        <button class="btn btn-primary" (click)="openAddModal()">
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
              <th>Order</th>
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
              <td>
                <button class="btn btn-sm btn-warning" 
                        *ngIf="product.currentStock <= product.minStockLevel"
                        (click)="orderNow(product.id!)">
                  <i class="fas fa-shopping-cart"></i> Order Now
                </button>
                <span *ngIf="product.currentStock > product.minStockLevel" class="text-muted">-</span>
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
                <label>Unit</label>
                <input type="text" class="form-control" [(ngModel)]="currentProduct.unit" name="unit" placeholder="e.g., piece, kg, liter" required>
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
            <div class="grid grid-2">
              <div class="form-group">
                <label>Current Stock</label>
                <input type="number" class="form-control" [(ngModel)]="currentProduct.currentStock" name="currentStock" required>
              </div>
              <div class="form-group">
                <label>Min Stock Level</label>
                <input type="number" class="form-control" [(ngModel)]="currentProduct.minStockLevel" name="minStockLevel" required>
              </div>
            </div>
            
            <!-- Suppliers Section -->
            <div class="suppliers-section">
              <h3><i class="fas fa-truck"></i> Product Suppliers</h3>
              <div class="supplier-list">
                <div class="supplier-item" *ngFor="let ps of selectedSuppliers; let i = index">
                  <div class="supplier-info">
                    <strong>{{ getSupplierName(ps.supplierId) }}</strong>
                    <span class="supplier-details">
                      ₹{{ ps.costPerUnit }}/unit • {{ ps.deliveryDays }} days delivery
                    </span>
                  </div>
                  <button type="button" class="btn-remove" (click)="removeSupplier(i)">
                    <i class="fas fa-times"></i>
                  </button>
                </div>
                <div class="no-suppliers" *ngIf="selectedSuppliers.length === 0">
                  <i class="fas fa-info-circle"></i> No suppliers added yet
                </div>
              </div>
              
              <button type="button" class="btn btn-secondary btn-sm" (click)="openAddSupplierModal()">
                <i class="fas fa-plus"></i> Add Supplier
              </button>
            </div>
            <div class="flex text-right mt-20">
              <button type="button" class="btn" (click)="closeModal()">Cancel</button>
              <button type="submit" class="btn btn-primary">Save</button>
            </div>
          </form>
        </div>
      </div>
      
      <!-- Add Supplier Modal -->
      <div class="modal-backdrop" *ngIf="showAddSupplierModal" (click)="closeAddSupplierModal()">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2 class="modal-title">Add Supplier for Product</h2>
            <button class="close-btn" (click)="closeAddSupplierModal()">&times;</button>
          </div>
          <form (ngSubmit)="addSupplierToProduct()">
            <div class="form-group">
              <label>Select Supplier</label>
              <select class="form-control" [(ngModel)]="newProductSupplier.supplierId" name="supplierId" required>
                <option value="">Choose a supplier</option>
                <option *ngFor="let sup of availableSuppliers" [value]="sup.id">
                  {{ sup.name }} - {{ sup.contactPerson }}
                </option>
              </select>
            </div>
            <div class="grid grid-2">
              <div class="form-group">
                <label>Cost per Unit (₹)</label>
                <input type="number" step="0.01" class="form-control" 
                       [(ngModel)]="newProductSupplier.costPerUnit" 
                       name="costPerUnit" required>
              </div>
              <div class="form-group">
                <label>Delivery Days</label>
                <input type="number" class="form-control" 
                       [(ngModel)]="newProductSupplier.deliveryDays" 
                       name="deliveryDays" required min="1">
              </div>
            </div>
            <div class="grid grid-2">
              <div class="form-group">
                <label>Min Order Quantity</label>
                <input type="number" class="form-control" 
                       [(ngModel)]="newProductSupplier.minimumOrderQuantity" 
                       name="minimumOrderQuantity" required min="1">
              </div>
              <div class="form-group">
                <label>Preferred Supplier</label>
                <label class="checkbox-label">
                  <input type="checkbox" [(ngModel)]="newProductSupplier.isPreferred" name="isPreferred">
                  <span>Mark as preferred supplier</span>
                </label>
              </div>
            </div>
            <div class="form-group">
              <label>Notes (Optional)</label>
              <textarea class="form-control" [(ngModel)]="newProductSupplier.notes" 
                        name="notes" rows="2" 
                        placeholder="Any special notes about this supplier..."></textarea>
            </div>
            <div class="flex text-right mt-20">
              <button type="button" class="btn" (click)="closeAddSupplierModal()">Cancel</button>
              <button type="submit" class="btn btn-primary">Add Supplier</button>
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
    td:last-child {
      text-align: center;
      min-width: 120px;
    }
    .text-muted {
      color: #999;
      font-size: 18px;
    }
    
    /* Suppliers Section */
    .suppliers-section {
      margin-top: 25px;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 8px;
    }
    
    .suppliers-section h3 {
      margin: 0 0 15px 0;
      font-size: 16px;
      color: #555;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .suppliers-section h3 i {
      color: #1976d2;
    }
    
    .supplier-list {
      margin-bottom: 15px;
    }
    
    .supplier-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px;
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      margin-bottom: 8px;
    }
    
    .supplier-info strong {
      display: block;
      color: #333;
      margin-bottom: 4px;
    }
    
    .supplier-details {
      font-size: 13px;
      color: #666;
    }
    
    .btn-remove {
      background: none;
      border: none;
      color: #dc3545;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 4px;
      transition: all 0.3s;
    }
    
    .btn-remove:hover {
      background: #ffebee;
    }
    
    .no-suppliers {
      text-align: center;
      padding: 20px;
      color: #999;
      font-size: 14px;
    }
    
    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      margin-top: 8px;
    }
    
    .checkbox-label input[type="checkbox"] {
      width: 18px;
      height: 18px;
      cursor: pointer;
    }
    
    .checkbox-label span {
      color: #555;
      font-size: 14px;
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
  showAddSupplierModal = false;
  currentProduct: Product = this.initializeProduct();
  
  // Product suppliers
  selectedSuppliers: ProductSupplier[] = [];
  availableSuppliers: Supplier[] = [];
  newProductSupplier: ProductSupplier = this.initializeProductSupplier();
  productSuppliers: ProductSupplier[] = [];
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 0;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private supplierService: SupplierService,
    private productSupplierService: ProductSupplierService,
    private notificationService: NotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
    this.loadSuppliers();
    this.loadProductSuppliers();
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

  initializeProductSupplier(): ProductSupplier {
    return {
      productId: '',
      supplierId: '',
      costPerUnit: 0,
      deliveryDays: 1,
      minimumOrderQuantity: 1,
      isPreferred: false,
      notes: ''
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

  loadProductSuppliers(): void {
    this.productSupplierService.getAllProductSuppliers().subscribe(ps => {
      this.productSuppliers = ps;
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
    // Load supplier relationships for this product
    if (product.id) {
      this.loadProductSupplierRelationships(product.id);
    }
  }

  deleteProduct(product: Product): void {
    if (confirm(`Are you sure you want to delete ${product.name}?`)) {
      this.productService.deleteProduct(product.id!).subscribe({
        next: () => {
          this.notificationService.showSuccess(`Product ${product.name} deleted successfully`);
          this.loadProducts();
        },
        error: (error) => {
          this.notificationService.showError('Failed to delete product');
        }
      });
    }
  }

  saveProduct(): void {
    if (this.showEditModal) {
      this.productService.updateProduct(this.currentProduct.id!, this.currentProduct).subscribe({
        next: (updatedProduct) => {
          // Save supplier relationships
          this.saveProductSuppliers(updatedProduct.id!);
          this.notificationService.showSuccess('Product updated successfully');
          this.loadProducts();
          this.closeModal();
        },
        error: (error) => {
          this.notificationService.showError('Failed to update product');
        }
      });
    } else {
      this.productService.createProduct(this.currentProduct).subscribe({
        next: (createdProduct) => {
          // Save supplier relationships
          this.saveProductSuppliers(createdProduct.id!);
          this.notificationService.showSuccess('Product created successfully');
          this.loadProducts();
          this.closeModal();
        },
        error: (error) => {
          this.notificationService.showError('Failed to create product');
        }
      });
    }
  }

  saveProductSuppliers(productId: string): void {
    // Delete existing relationships for this product
    const existingRelations = this.productSuppliers.filter(ps => ps.productId === productId);
    const deletePromises = existingRelations.map(ps => 
      this.productSupplierService.deleteProductSupplier(ps.id!).toPromise()
    );

    Promise.all(deletePromises).then(() => {
      // Create new relationships
      this.selectedSuppliers.forEach(supplier => {
        supplier.productId = productId;
        this.productSupplierService.createProductSupplier(supplier).subscribe({
          error: (error) => {
            console.error('Error creating supplier relationship:', error);
          }
        });
      });
    });
  }

  closeModal(): void {
    this.showAddModal = false;
    this.showEditModal = false;
    this.currentProduct = this.initializeProduct();
    this.selectedSuppliers = [];
  }

  openAddModal(): void {
    this.showAddModal = true;
    this.currentProduct = this.initializeProduct();
    this.selectedSuppliers = [];
  }

  // Supplier management methods
  loadProductSupplierRelationships(productId: string): void {
    this.productSupplierService.getSuppliersByProductId(productId).subscribe({
      next: (suppliers) => {
        this.selectedSuppliers = suppliers;
      },
      error: (error) => {
        console.error('Error loading product suppliers:', error);
      }
    });
  }

  getSupplierName(supplierId: string): string {
    const supplier = this.suppliers.find(s => s.id === supplierId);
    return supplier ? supplier.name : 'Unknown Supplier';
  }

  removeSupplier(index: number): void {
    this.selectedSuppliers.splice(index, 1);
  }

  openAddSupplierModal(): void {
    this.showAddSupplierModal = true;
    this.newProductSupplier = this.initializeProductSupplier();
    this.updateAvailableSuppliers();
  }

  closeAddSupplierModal(): void {
    this.showAddSupplierModal = false;
    this.newProductSupplier = this.initializeProductSupplier();
  }

  addSupplierToProduct(): void {
    // Check if supplier already added
    const exists = this.selectedSuppliers.some(
      ps => ps.supplierId === this.newProductSupplier.supplierId
    );

    if (exists) {
      this.notificationService.showWarning('This supplier is already added');
      return;
    }

    // If this is marked as preferred, unmark other suppliers
    if (this.newProductSupplier.isPreferred) {
      this.selectedSuppliers.forEach(ps => ps.isPreferred = false);
    }

    this.selectedSuppliers.push({ ...this.newProductSupplier });
    this.notificationService.showSuccess('Supplier added successfully');
    this.closeAddSupplierModal();

    // Update available suppliers
    this.updateAvailableSuppliers();
  }

  updateAvailableSuppliers(): void {
    const selectedIds = this.selectedSuppliers.map(ps => ps.supplierId);
    this.availableSuppliers = this.suppliers.filter(
      s => !selectedIds.includes(s.id!)
    );
  }

  orderNow(productId: string): void {
    this.router.navigate(['/order-now', productId]);
  }
}
