import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-square',
  template: ` <p>square works! {{ value }}</p> `,
  styles: [],
})
export class SquareComponent {
  @Input() value: 'X' | 'O' = 'O';
  rando = Math.random();
}
