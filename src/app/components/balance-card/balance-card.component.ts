import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-balance-card',
    imports: [CommonModule],
    standalone: true,
    templateUrl: './balance-card.component.html',
    styleUrls: ['./balance-card.component.css']
})
export class BalanceCardComponent {
    @Input() balance: number = 0;
}
