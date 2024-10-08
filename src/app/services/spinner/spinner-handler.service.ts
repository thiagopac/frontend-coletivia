import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpinnerHandlerService {
  private numberOfRequests = 0;
  public showSpinner: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  handleRequest = (state: string = 'minus'): void => {
    this.numberOfRequests =
      state === 'plus' ? this.numberOfRequests + 1 : this.numberOfRequests - 1;
    this.showSpinner.next(this.numberOfRequests > 0);
  };

  getNumberOfRequests(): number {
    return this.numberOfRequests;
  }

  constructor() {}
}
