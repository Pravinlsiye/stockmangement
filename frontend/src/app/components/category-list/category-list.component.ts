import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-category-list',
  template: `
    <div class="category-list">
      <div class="flex-between mb-20">
        <h1>Categories</h1>
        <button class="btn btn-primary" (click)="showAddModal = true">
          <i class="fas fa-plus"></i> Add Category
        </button>
      </div>

      <div class="grid grid-3">
        <div class="card" *ngFor="let category of categories">
          <h3>{{ category.name }}</h3>
          <p>{{ category.description }}</p>
          <div class="flex mt-20">
            <button class="btn btn-sm btn-primary" (click)="editCategory(category)"><i class="fas fa-edit"></i> Edit</button>
            <button class="btn btn-sm btn-danger" (click)="deleteCategory(category)"><i class="fas fa-trash"></i> Delete</button>
          </div>
        </div>
      </div>

      <!-- Add/Edit Category Modal -->
      <div class="modal-backdrop" *ngIf="showAddModal || showEditModal" (click)="closeModal()">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2 class="modal-title">{{ showEditModal ? 'Edit' : 'Add' }} Category</h2>
            <button class="close-btn" (click)="closeModal()">&times;</button>
          </div>
          <form (ngSubmit)="saveCategory()">
            <div class="form-group">
              <label>Name</label>
              <input type="text" class="form-control" [(ngModel)]="currentCategory.name" name="name" required>
            </div>
            <div class="form-group">
              <label>Description</label>
              <textarea class="form-control" [(ngModel)]="currentCategory.description" name="description" rows="3"></textarea>
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
    .category-list h1 {
      margin: 0;
      color: #333;
    }
    .card h3 {
      margin: 0 0 10px 0;
      color: #1976D2;
    }
  `]
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];
  showAddModal = false;
  showEditModal = false;
  currentCategory: Category = { name: '', description: '' };

  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  editCategory(category: Category): void {
    this.currentCategory = { ...category };
    this.showEditModal = true;
  }

  deleteCategory(category: Category): void {
    if (confirm(`Are you sure you want to delete ${category.name}?`)) {
      this.categoryService.deleteCategory(category.id!).subscribe(() => {
        this.loadCategories();
      });
    }
  }

  saveCategory(): void {
    if (this.showEditModal) {
      this.categoryService.updateCategory(this.currentCategory.id!, this.currentCategory).subscribe(() => {
        this.loadCategories();
        this.closeModal();
      });
    } else {
      this.categoryService.createCategory(this.currentCategory).subscribe(() => {
        this.loadCategories();
        this.closeModal();
      });
    }
  }

  closeModal(): void {
    this.showAddModal = false;
    this.showEditModal = false;
    this.currentCategory = { name: '', description: '' };
  }
}
