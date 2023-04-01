import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  concatMap,
  filter,
  map,
  Observable,
  Subject,
  Subscription,
  takeWhile,
  tap,
} from 'rxjs';

type Player = 'X' | 'O';
const lines: number[][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit, OnDestroy {
  squares = new BehaviorSubject<(Player | null)[]>([]);
  moves: Subject<number> = new Subject<number>();
  xIsNext: boolean = true;
  winner: Observable<Player | null>;
  _subs: Subscription[] = [];

  constructor() {
    this.winner = this.squares.pipe(
      map((squares) => {
        for (const line of lines) {
          const player = squares[line[0]];
          if (player) {
            const playerWon = line.every((idx) => squares[idx] === player);
            if (playerWon) return player;
          }
        }
        return null;
      })
    );
  }

  get player(): Player {
    return this.xIsNext ? 'X' : 'O';
  }

  ngOnInit(): void {
    this.newGame();
  }

  ngOnDestroy(): void {
    this._subs.forEach((sub) => sub.unsubscribe());
  }

  newGame(): void {
    this.squares.next(Array(9).fill(null));
    this._subs.push(this.onMakeMove().subscribe());
    this.xIsNext = true;
  }

  makeMove(idx: number): void {
    this.moves.next(idx);
  }

  onMakeMove() {
    return this.moves.pipe(
      filter((idx) => !this.squares.getValue()[idx]),
      map((idx) => {
        const squares = this.squares.getValue();
        squares.splice(idx, 1, this.player);
        return squares;
      }),
      tap((newSquares) => {
        this.squares.next(newSquares);
        this.xIsNext = !this.xIsNext;
      }),
      concatMap(() => this.winner),
      takeWhile((winner) => winner === null)
    );
  }
}
