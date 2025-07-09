import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal',
  template: `
    <div class="modal-backdrop" (click)="close.emit()"></div>
    <div class="modal-content">
      <div class="modal-message">{{ message }}</div>
      <button class="modal-close" (click)="close.emit()">OK</button>
    </div>
  `,
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  @Input() message = '';
  @Output() close = new EventEmitter<void>();
}
