import { Component, OnInit, DoCheck } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from './modal.component';
import jsPDF from 'jspdf';
import { Router } from '@angular/router';
import { AddTransactionModalComponent } from "./add-transaction-modal.component";
import { TabSwitchComponent } from './tab-switch.component';
import { TransactionsActionsBarComponent } from './transactions-actions-bar.component';
import { TransactionsTableComponent } from './transactions-table.component';
import { DashboardChartsComponent } from './dashboard-charts.component';

interface Transaction {
  id: number;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  date: string;
  description?: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ModalComponent,
    AddTransactionModalComponent,
    TabSwitchComponent,
    TransactionsActionsBarComponent,
    TransactionsTableComponent,
    DashboardChartsComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, DoCheck {
  editingTransaction: Transaction | null = null;
  activeTab: 'table' | 'charts' = 'table';
  showRowHighlight = false;
  showAddModal = false;
  showRemoveModal = false;
  transactionToRemove: number|null = null;

  balance: number = 1234.56;
  totalIncome: number = 2500;
  totalExpense: number = 1265.44;

  transactions: Transaction[] = [
    { id: 1, type: 'expense', amount: -45.90, category: 'Supermercato', date: '2025-07-01', description: 'Spesa supermercato' },
    { id: 2, type: 'income', amount: 2000, category: 'Stipendio', date: '2025-07-02', description: 'Stipendio' },
    { id: 3, type: 'expense', amount: -12.99, category: 'Abbonamento', date: '2025-07-03', description: 'Abbonamento Netflix' },
    { id: 4, type: 'expense', amount: -38.50, category: 'Ristorante', date: '2025-07-04', description: 'Cena fuori' },
    { id: 5, type: 'income', amount: 150, category: 'Vendita', date: '2025-07-05', description: 'Vendita usato' },
    { id: 6, type: 'expense', amount: -80, category: 'Trasporti', date: '2025-07-06', description: 'Abbonamento bus' },
    { id: 7, type: 'expense', amount: -60, category: 'Spese casa', date: '2025-07-07', description: 'Bollette' },
    { id: 8, type: 'income', amount: 300, category: 'Bonus', date: '2025-07-08', description: 'Bonus una tantum' },
  ];

  filteredTransactions: Transaction[] = [];
  categories: string[] = [];
  searchTerm = '';
  filterCategory = '';
  filterType = '';

  showModal = false;
  modalMessage = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    if (localStorage.getItem('isAuthenticated') !== 'true') {
      this.router.navigate(['/login']);
      return;
    }
    this.categories = Array.from(new Set(this.transactions.map(t => t.category)));
    this.filteredTransactions = [...this.transactions];
  }

  ngDoCheck() {
    if (localStorage.getItem('isAuthenticated') !== 'true') {
      this.router.navigate(['/login']);
    }
  }

  filterTransactions() {
    this.filteredTransactions = this.transactions.filter(t => {
      const matchesSearch =
        this.searchTerm.trim() === '' ||
        t.description?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesCategory = !this.filterCategory || t.category === this.filterCategory;
      const matchesType = !this.filterType || t.type === this.filterType;
      return matchesSearch && matchesCategory && matchesType;
    });
  }

  openAddModal() {
    this.editingTransaction = null;
    this.showAddModal = true;
  }

  onEditTransaction(t: Transaction) {
    this.editingTransaction = { ...t };
    this.showAddModal = true;
  }
  addTransaction(t: any) {
    if (this.editingTransaction) {
      // Modifica esistente
      const idx = this.transactions.findIndex(tr => tr.id === this.editingTransaction!.id);
      if (idx > -1) {
        this.transactions[idx] = { ...this.editingTransaction, ...t, id: this.editingTransaction.id };
        this.modalMessage = 'Transazione modificata con successo!';
      }
      this.editingTransaction = null;
    } else {
      // Nuova transazione
      const newId = Math.max(...this.transactions.map(tr => tr.id), 0) + 1;
      const tx = { ...t, id: newId };
      this.transactions.unshift(tx);
      this.showRowHighlight = true;
      setTimeout(() => { this.showRowHighlight = false; }, 1200);
      this.modalMessage = 'Transazione aggiunta con successo!';
    }
    this.categories = Array.from(new Set(this.transactions.map(tr => tr.category)));
    this.filterTransactions();
    this.showModal = true;
  }
  openRemoveModal(id?: number) {
    if (id) this.transactionToRemove = id;
    this.showRemoveModal = true;
  }
  removeTransaction() {
    if (this.transactionToRemove != null) {
      this.transactions = this.transactions.filter(t => t.id !== this.transactionToRemove);
      this.filterTransactions();
      this.categories = Array.from(new Set(this.transactions.map(tr => tr.category)));
      this.modalMessage = 'Transazione rimossa!';
      this.showModal = true;
      this.transactionToRemove = null;
    }
    this.showRemoveModal = false;
  }
  exportTransactions() {
    const rows = [
      ['Data', 'Descrizione', 'Categoria', 'Importo'],
      ...this.transactions.map(t => [t.date, t.description, t.category, t.amount.toString()])
    ];
    const csv = rows.map(r => r.map(x => '"' + (x !== undefined && x !== null ? String(x).replace(/"/g, '""') : '') + '"').join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'transazioni.csv';
    a.click();
    this.modalMessage = 'Esportazione completata!';
    this.showModal = true;
  }
  downloadPDF() {
    // Usa jsPDF importato staticamente
    const doc = new jsPDF();
    doc.text('Transazioni', 10, 10);
    let y = 20;
    this.transactions.forEach(t => {
      doc.text(`${t.date} | ${t.description} | ${t.category} | ${t.amount} €`, 10, y);
      y += 8;
    });
    doc.save('transazioni.pdf');
    this.modalMessage = 'PDF scaricato!';
    this.showModal = true;
  }


  // Cambia tab
  setTab(tab: 'table' | 'charts') {
    this.activeTab = tab;
  }
}
