import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SocketIOService } from 'src/app/services/socket-io.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-account-balance-component',
  templateUrl: './account-balance.component.html',
  styleUrls: ['./account-balance.component.scss'],
})
export class AccountBalanceComponent implements OnInit {
  balance$: Observable<any>;

  constructor(
    private userService: UserService,
    private socketIOService: SocketIOService
  ) {}

  ngOnInit(): void {
    this.balance$ = this.userService.getBalance();

    this.socketIOService.onBalanceRefresh().subscribe(() => {
      this.balance$ = this.userService.getBalance();
    });
  }
}
