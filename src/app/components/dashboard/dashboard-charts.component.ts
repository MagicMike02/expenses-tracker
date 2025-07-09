import { Component, Input, AfterViewChecked, OnDestroy } from '@angular/core';
import Chart from 'chart.js/auto';
@Component({
  selector: 'app-dashboard-charts',
  standalone: true,
  template: `
    <div class="charts-flex">
      <div class="chart-box">
        <h2>Andamento spese/entrate</h2>
        <canvas id="expensesChart" width="480" height="320"></canvas>
      </div>
      <div class="chart-box">
        <h3 class="pie-title">Distribuzione per categoria</h3>
        <canvas id="pieChart" width="340" height="320"></canvas>
      </div>
    </div>
  `,
  styleUrls: ['./dashboard.component.css']
})
export class DashboardChartsComponent implements AfterViewChecked, OnDestroy {
  @Input() transactions: any[] = [];
  private barChart: Chart|null = null;
  private pieChart: Chart|null = null;
  ngAfterViewChecked() {
    this.renderCharts();
  }
  ngOnDestroy() {
    if (this.barChart) { this.barChart.destroy(); this.barChart = null; }
    if (this.pieChart) { this.pieChart.destroy(); this.pieChart = null; }
  }
  renderCharts() {
    const ctx = document.getElementById('expensesChart') as HTMLCanvasElement;
    if (ctx && !this.barChart) {
      const labels = this.transactions.map(t => t.date);
      const incomes = this.transactions.map(t => t.amount > 0 ? t.amount : 0);
      const expenses = this.transactions.map(t => t.amount < 0 ? Math.abs(t.amount) : 0);
      this.barChart = new Chart(ctx, {
        type: 'bar',
        data: { labels, datasets: [
          { label: 'Entrate', data: incomes, backgroundColor: 'rgba(75, 192, 192, 0.6)' },
          { label: 'Uscite', data: expenses, backgroundColor: 'rgba(255, 99, 132, 0.6)' }
        ]},
        options: { responsive: true, plugins: { legend: { position: 'top' }, title: { display: false } } }
      });
    }
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
        options: { plugins: { legend: { position: 'bottom' }, title: { display: false } } }
      });
    }
  }
}
