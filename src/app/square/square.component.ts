import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-square',
  template: `
    <button nbButton *ngIf="!value"></button>
    <button
      *ngIf="!!value"
      nbButton
      hero
      [status]="value == 'X' ? 'success' : 'info'"
    >
      {{ value }}
    </button>
  `,
  styles: ['button {height: 100%; width: 100%; }'],
})
export class SquareComponent {
  @Input() value: 'X' | 'O' | null = 'O';
}
