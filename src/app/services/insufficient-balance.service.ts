import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InsufficientBalanceService {
  bloqueio$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor() {}

  bloqueado$ = this.bloqueio$.asObservable();
  setBloqueio(status: boolean) {
    this.bloqueio$.next(status);
  }
}
