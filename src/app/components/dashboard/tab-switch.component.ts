import { Component, Input, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'app-tab-switch',
  standalone: true,
  template: `
    <div class="dashboard-tabs">
      <button [class.active]="activeTab === 'table'" (click)="tabChange.emit('table')">Tabella</button>
      <button [class.active]="activeTab === 'charts'" (click)="tabChange.emit('charts')">Grafici</button>
    </div>
  `,
  styleUrls: ['./dashboard.component.css']
})
export class TabSwitchComponent {
  @Input() activeTab: 'table' | 'charts' = 'table';
  @Output() tabChange = new EventEmitter<'table'|'charts'>();
}
