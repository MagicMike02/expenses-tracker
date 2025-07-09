import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private categories: string[] = [
    'Spesa',
    'Stipendio',
    'Affitto',
    'Divertimento',
    'Trasporti',
    'Altro'
  ];

  getCategories(): string[] {
    return this.categories;
  }

  addCategory(category: string) {
    if (category && !this.categories.includes(category)) {
      this.categories.push(category);
    }
  }

  removeCategory(category: string) {
    this.categories = this.categories.filter(c => c !== category);
  }
}
