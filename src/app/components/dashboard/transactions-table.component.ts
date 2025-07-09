import { Component, Input } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-transactions-table',
  standalone: true,
  imports: [CommonModule],
  providers: [CurrencyPipe],
  template: `
    <table class="transactions-table-modern">
      <thead>
        <tr>
          <th>Data</th>
          <th>Descrizione</th>
          <th>Categoria</th>
          <th>Importo</th>
          <th style="width: 80px; text-align: center;">Azioni</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngIf="transactions.length === 0">
          <td colspan="5" style="text-align:center; color:#888; font-style:italic;">Nessuna transazione trovata</td>
        </tr>
        <tr *ngFor="let t of transactions; let i = index" [class.row-highlight]="i === 0 && showRowHighlight">
          <td>{{ t.date }}</td>
          <td>{{ t.description }}</td>
          <td><span class="badge badge-{{t.type}}">{{ t.category }}</span></td>
          <td [ngClass]="{'income': t.amount > 0, 'expense': t.amount < 0}">
            {{ t.amount | currency:'EUR':'symbol':'1.2-2' }}
          </td>
          <td style="text-align: center;">
            <button type="button" class="action-btn edit" (click)="edit.emit(t)" aria-label="Modifica" title="Modifica">
              <svg viewBox="0 0 24 24"><path d="M4 21h4.5l10-10.01a2.12 2.12 0 0 0 0-3l-2.5-2.5a2.12 2.12 0 0 0-3 0L4 15.5V21z"/><path d="M14.5 7.5l2.5 2.5"/></svg>
            </button>
            <button type="button" class="action-btn delete" (click)="delete.emit(t)" aria-label="Elimina" title="Elimina">
              <svg viewBox="0 0 24 24"><path d="M6 7h12M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7h12z"/></svg>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  `,
  styleUrls: ['./dashboard.component.css']
})
export class TransactionsTableComponent {
  @Input() transactions: any[] = [];
  @Input() showRowHighlight = false;
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
}
