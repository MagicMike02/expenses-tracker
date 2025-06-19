import { Component, OnInit } from '@angular/core';
import { BalanceCardComponent } from '../balance-card/balance-card.component';
import { SummaryCardComponent } from '../summary-card/summary-card.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [BalanceCardComponent, SummaryCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  balance: number = 1234.56; // mock saldo
  totalIncome: number = 2500;
  totalExpense: number = 1265.44;

  ngOnInit(): void {
    // qui la logica per caricare dati
  }
}
