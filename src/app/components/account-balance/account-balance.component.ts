import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs';
import { InsufficientBalanceService } from 'src/app/services/insufficient-balance.service';
import { SocketIOService } from 'src/app/services/socket-io.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-account-balance-component',
  templateUrl: './account-balance.component.html',
  styleUrls: ['./account-balance.component.scss'],
})
export class AccountBalanceComponent implements OnInit {
  balance: any;

  constructor(
    private userService: UserService,
    private socketIOService: SocketIOService,
    private changeDetectorRef: ChangeDetectorRef,
    private insufficientBalanceService: InsufficientBalanceService
  ) {}

  ngOnInit(): void {
    this.getBalance();

    this.socketIOService.onBalanceRefresh().subscribe(() => {
      this.getBalance();
    });
  }

  getBalance() {
    this.userService.getBalance().subscribe((res) => {
      this.balance = res;

      if (+res.current_balance <= 0) {
        this.insufficientBalanceService.setBloqueio(true);
      }

      this.changeDetectorRef.detectChanges();
    });
  }
}
