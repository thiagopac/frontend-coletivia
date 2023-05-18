import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService, UserType } from 'src/app/modules/auth';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
})
export class AccountComponent implements OnInit {
  user: UserType;
  balance$: Observable<any>;

  constructor(private auth: AuthService, private asyncPipe: AsyncPipe) {}

  ngOnInit(): void {
    this.user = this.asyncPipe.transform(
      this.auth.currentUserSubject.asObservable()
    )!;
    // this.balance$ = this.generalService.getUserBalance();
  }
}
