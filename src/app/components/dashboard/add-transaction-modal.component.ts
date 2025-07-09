import { Component, EventEmitter, Output, Input, ElementRef, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-add-transaction-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-backdrop" (click)="close.emit()"></div>
    <div class="modal-content">
      <h3>Aggiungi transazione</h3>
      <form (ngSubmit)="submit()" #f="ngForm">
        <input #firstInput type="text" placeholder="Descrizione" [(ngModel)]="description" name="description" required class="modal-input" />
        <input type="number" placeholder="Importo" [(ngModel)]="amount" name="amount" required class="modal-input" />
        <select [(ngModel)]="type" name="type" required class="modal-input">
          <option value="income">Entrata</option>
          <option value="expense">Uscita</option>
        </select>
        <ng-container *ngIf="!showNewCategoryInput">
          <select [(ngModel)]="category" name="category" required class="modal-input">
            <option value="" disabled selected>Seleziona categoria</option>
            <option *ngFor="let cat of categories" [value]="cat">{{cat}}</option>
            <option value="__new__">+ Nuova categoria...</option>
          </select>
        </ng-container>
        <ng-container *ngIf="showNewCategoryInput">
          <div style="display: flex; gap: 0.5rem; ">
            <input type="text" placeholder="Nuova categoria" [(ngModel)]="newCategory" name="newCategory" class="modal-input" required />
            <div class="modal-newcat-actions">
              <button type="button" (click)="addNewCategory()" [disabled]="!newCategory.trim()">Aggiungi</button>
              <button type="button" (click)="cancelNewCategory()">Annulla</button>
            </div>
          </div>
        </ng-container>
        <input type="date" [(ngModel)]="date" name="date" required class="modal-input" />
        <div class="modal-actions">
          <button type="submit" [disabled]="!f.form.valid">Aggiungi</button>
          <button type="button" (click)="close.emit()">Annulla</button>
        </div>
      </form>
    </div>
  `,
  styleUrls: ['./modal.component.css']
})

export class AddTransactionModalComponent implements AfterViewInit {
  @ViewChild('firstInput') firstInput!: ElementRef<HTMLInputElement>;
  ngAfterViewInit() {
    setTimeout(() => {
      this.firstInput?.nativeElement?.focus();
    }, 0);
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEsc(event: KeyboardEvent) {
    event.preventDefault();
    this.close.emit();
  }
  @Input() categories: string[] = [];
  @Output() add = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();
  description: string = '';
  amount: number|null = null;
  type: 'income' | 'expense' = 'expense';
  category: string = '';
  date: string = '';

  showNewCategoryInput: boolean = false;
  newCategory: string = '';

  constructor(private categoryService: CategoryService) {
    // Imposta la data di default ad oggi (formato yyyy-MM-dd)
    const today = new Date();
    this.date = today.toISOString().slice(0, 10);
  }

  ngDoCheck() {
    if (this.category === '__new__' && !this.showNewCategoryInput) {
      this.showNewCategoryInput = true;
      this.newCategory = '';
    }
  }

  addNewCategory() {
    const cat = this.newCategory.trim();
    if (cat && !this.categories.includes(cat)) {
      // Aggiorna la lista solo localmente, non tramite service
      this.categories = [...this.categories, cat];
      this.category = cat;
      this.showNewCategoryInput = false;
      this.newCategory = '';
    }
  }

  cancelNewCategory() {
    this.showNewCategoryInput = false;
    this.category = '';
    this.newCategory = '';
  }

  submit() {
    if (this.description && this.amount && this.category && this.date) {
      this.add.emit({
        description: this.description,
        amount: this.type === 'expense' ? -Math.abs(this.amount) : Math.abs(this.amount),
        type: this.type,
        category: this.category,
        date: this.date
      });
      this.close.emit();
    }
  }
}