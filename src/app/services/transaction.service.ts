// src/app/services/transaction.service.ts

import { Injectable } from '@angular/core';

export interface Transaction {
    id: number;
    type: 'income' | 'expense';
    amount: number;
    category: string;
    date: string;
    description?: string;
}

@Injectable({
    providedIn: 'root'
})
export class TransactionService {
    private transactions: Transaction[] = [
        {
            id: 1,
            type: 'income',
            amount: 1000,
            category: 'Stipendio',
            date: '2025-06-01',
            description: 'Pagamento mensile'
        },
        {
            id: 2,
            type: 'expense',
            amount: 200,
            category: 'Supermercato',
            date: '2025-06-05'
        },
        {
            id: 3,
            type: 'expense',
            amount: 80,
            category: 'Trasporti',
            date: '2025-06-07'
        },
        {
            id: 4,
            type: 'income',
            amount: 150,
            category: 'Vendita usato',
            date: '2025-06-10'
        }
    ];

    getTransactions() {
        return [...this.transactions];
    }
}
