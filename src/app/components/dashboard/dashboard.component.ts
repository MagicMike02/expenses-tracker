import { Component, OnInit, DoCheck } from '@angular/core';
import Chart from 'chart.js/auto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from './modal.component';
import jsPDF from 'jspdf';
import { Router } from '@angular/router';
import { AddTransactionModalComponent } from "./add-transaction-modal.component";

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
  imports: [CommonModule, FormsModule, ModalComponent, AddTransactionModalComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, DoCheck {
  // Tab switch: 'table' or 'charts'
  activeTab: 'table' | 'charts' = 'table';
  private barChart: Chart|null = null;
  private pieChart: Chart|null = null;
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
    this.showAddModal = true;
  }
  addTransaction(t: any) {
    const newId = Math.max(...this.transactions.map(tr => tr.id), 0) + 1;
    const tx = { ...t, id: newId };
    this.transactions.unshift(tx);
    this.categories = Array.from(new Set(this.transactions.map(tr => tr.category)));
    this.filterTransactions();
    this.showRowHighlight = true;
    setTimeout(() => { this.showRowHighlight = false; }, 1200);
    this.modalMessage = 'Transazione aggiunta con successo!';
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


  // Renderizza i grafici quando la tab "Grafici" viene attivata
  ngAfterViewChecked(): void {
    if (this.activeTab === 'charts') {
      this.renderCharts();
    }
  }

  renderCharts() {
    // Bar chart
    const ctx = document.getElementById('expensesChart') as HTMLCanvasElement;
    if (ctx && !this.barChart) {
      const labels = this.transactions.map(t => t.date);
      const incomes = this.transactions.map(t => t.amount > 0 ? t.amount : 0);
      const expenses = this.transactions.map(t => t.amount < 0 ? Math.abs(t.amount) : 0);
      this.barChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: 'Entrate',
              data: incomes,
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
            {
              label: 'Uscite',
              data: expenses,
              backgroundColor: 'rgba(255, 99, 132, 0.6)',
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'top' },
            title: { display: false }
          }
        }
      });
    }
    // Pie chart
    const pie = document.getElementById('pieChart') as HTMLCanvasElement;
    if (pie && !this.pieChart) {
      const catMap: { [cat: string]: number } = {};
      this.transactions.forEach(t => {
        if (!catMap[t.category]) catMap[t.category] = 0;
        catMap[t.category] += Math.abs(t.amount);
      });
      this.pieChart = new Chart(pie, {
        type: 'pie',
        data: {
          labels: Object.keys(catMap),
          datasets: [{
            data: Object.values(catMap),
            backgroundColor: [
              '#43a047', '#1976d2', '#e53935', '#ffb300', '#8e24aa', '#00897b', '#f4511e', '#3949ab'
            ]
          }]
        },
        options: {
          plugins: {
            legend: { position: 'bottom' },
            title: { display: false }
          }
        }
      });
    }
  }

  // Quando si cambia tab, resetta i grafici se si torna su "Tabella"
  setTab(tab: 'table' | 'charts') {
    this.activeTab = tab;
    if (tab === 'table') {
      if (this.barChart) { this.barChart.destroy(); this.barChart = null; }
      if (this.pieChart) { this.pieChart.destroy(); this.pieChart = null; }
    }
  }
}
