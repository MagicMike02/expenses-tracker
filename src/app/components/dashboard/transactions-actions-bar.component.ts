import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-transactions-actions-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="transactions-actions-bar">
      <div class="filters-group">
        <select class="filter-select" [(ngModel)]="filterCategory" (change)="filterTransactions.emit()">
          <option value="">Tutte le categorie</option>
          <option *ngFor="let cat of categories" [value]="cat">{{cat}}</option>
        </select>
        <select class="filter-select" [(ngModel)]="filterType" (change)="filterTransactions.emit()">
          <option value="">Tutti i tipi</option>
          <option value="income">Entrate</option>
          <option value="expense">Uscite</option>
        </select>
        <input id="search-transactions" class="search-input" type="text" placeholder="Cerca o filtra..." [(ngModel)]="searchTerm" (input)="filterTransactions.emit()" autocomplete="off" />
      </div>
      <div class="actions-group">
        <button class="quick-action add" (click)="openAddModal.emit()">Aggiungi</button>
        <button class="quick-action export" (click)="exportTransactions.emit()">Esporta</button>
        <button class="quick-action pdf" (click)="downloadPDF.emit()">Scarica PDF</button>
      </div>
    </div>
  `,
  styleUrls: ['./dashboard.component.css']
})
export class TransactionsActionsBarComponent {
  @Input() categories: string[] = [];
  @Input() filterCategory = '';
  @Input() filterType = '';
  @Input() searchTerm = '';
  @Output() filterTransactions = new EventEmitter<void>();
  @Output() openAddModal = new EventEmitter<void>();
  @Output() exportTransactions = new EventEmitter<void>();
  @Output() downloadPDF = new EventEmitter<void>();
}
