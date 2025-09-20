import { Component, OnInit } from '@angular/core';
import { SupplierService } from '../../services/supplier.service';
import { Supplier } from '../../models/supplier.model';

@Component({
  selector: 'app-supplier-list',
  template: `
    <div class="supplier-list">
      <div class="flex-between mb-20">
        <h1>Suppliers</h1>
        <button class="btn btn-primary" (click)="showAddModal = true">
          <i class="fas fa-plus"></i> Add Supplier
        </button>
      </div>

      <div class="card">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Contact Person</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let supplier of paginatedSuppliers">
              <td>{{ supplier.name }}</td>
              <td>{{ supplier.contactPerson }}</td>
              <td>{{ supplier.email }}</td>
              <td>{{ supplier.phone }}</td>
              <td>{{ supplier.address }}</td>
              <td>
                <div class="flex">
                  <button class="btn btn-sm btn-primary" (click)="editSupplier(supplier)"><i class="fas fa-edit"></i> Edit</button>
                  <button class="btn btn-sm btn-danger" (click)="deleteSupplier(supplier)"><i class="fas fa-trash"></i> Delete</button>
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

      <!-- Add/Edit Supplier Modal -->
      <div class="modal-backdrop" *ngIf="showAddModal || showEditModal" (click)="closeModal()">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2 class="modal-title">{{ showEditModal ? 'Edit' : 'Add' }} Supplier</h2>
            <button class="close-btn" (click)="closeModal()">&times;</button>
          </div>
          <form (ngSubmit)="saveSupplier()">
            <div class="form-group">
              <label>Company Name</label>
              <input type="text" class="form-control" [(ngModel)]="currentSupplier.name" name="name" required>
            </div>
            <div class="form-group">
              <label>Contact Person</label>
              <input type="text" class="form-control" [(ngModel)]="currentSupplier.contactPerson" name="contactPerson" required>
            </div>
            <div class="grid grid-2">
              <div class="form-group">
                <label>Email</label>
                <input type="email" class="form-control" [(ngModel)]="currentSupplier.email" name="email" required>
              </div>
              <div class="form-group">
                <label>Phone</label>
                <input type="tel" class="form-control" [(ngModel)]="currentSupplier.phone" name="phone" required>
              </div>
            </div>
            <div class="form-group">
              <label>Address</label>
              <textarea class="form-control" [(ngModel)]="currentSupplier.address" name="address" rows="2" required></textarea>
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
    .supplier-list h1 {
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
export class SupplierListComponent implements OnInit {
  suppliers: Supplier[] = [];
  paginatedSuppliers: Supplier[] = [];
  showAddModal = false;
  showEditModal = false;
  currentSupplier: Supplier = this.initializeSupplier();
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 0;

  constructor(private supplierService: SupplierService) { }

  ngOnInit(): void {
    this.loadSuppliers();
  }

  initializeSupplier(): Supplier {
    return {
      name: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: ''
    };
  }

  loadSuppliers(): void {
    this.supplierService.getAllSuppliers().subscribe(suppliers => {
      this.suppliers = suppliers;
      this.updatePagination();
    });
  }
  
  updatePagination(): void {
    this.totalPages = Math.ceil(this.suppliers.length / this.itemsPerPage);
    this.goToPage(1);
  }
  
  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    
    this.currentPage = page;
    const startIndex = (page - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedSuppliers = this.suppliers.slice(startIndex, endIndex);
  }

  editSupplier(supplier: Supplier): void {
    this.currentSupplier = { ...supplier };
    this.showEditModal = true;
  }

  deleteSupplier(supplier: Supplier): void {
    if (confirm(`Are you sure you want to delete ${supplier.name}?`)) {
      this.supplierService.deleteSupplier(supplier.id!).subscribe(() => {
        this.loadSuppliers();
      });
    }
  }

  saveSupplier(): void {
    if (this.showEditModal) {
      this.supplierService.updateSupplier(this.currentSupplier.id!, this.currentSupplier).subscribe(() => {
        this.loadSuppliers();
        this.closeModal();
      });
    } else {
      this.supplierService.createSupplier(this.currentSupplier).subscribe(() => {
        this.loadSuppliers();
        this.closeModal();
      });
    }
  }

  closeModal(): void {
    this.showAddModal = false;
    this.showEditModal = false;
    this.currentSupplier = this.initializeSupplier();
  }
}
