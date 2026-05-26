import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'success-modal',
  templateUrl: './success-modal.component.html',
  styleUrls: ['./success-modal.component.css']
})
export class SuccessModalComponent {
  @Input() isVisible = false;
  @Input() email = '';
  @Output() closeModal = new EventEmitter<void>();
  @Output() navigate = new EventEmitter<void>();

  close() {
    this.closeModal.emit();
  }

  navigateToLogin() {
    this.navigate.emit();
  }
}