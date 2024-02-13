import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap, shareReplay } from 'rxjs';
import { RechargeService } from 'src/app/services/recharge.service';

@Component({
  selector: 'app-recharge-list',
  templateUrl: './recharge-list.component.html',
  styleUrls: ['./recharge-list.component.scss'],
})
export class RechargeListComponent implements OnInit {
  items$: Observable<any>;
  currentPage = 0;
  itemsPerPage = 10;
  totalItems = 0;

  constructor(
    private rechargeService: RechargeService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    const page = this.currentPage + 1;
    const perPage = this.itemsPerPage;

    this.items$ = this.rechargeService.list(page, perPage).pipe(
      tap((response: any) => {
        this.totalItems = response.meta.total;
      }),
      shareReplay(1)
    );
  }

  goToPage(event: any): void {
    this.itemsPerPage = event.pageSize;
    this.currentPage = event.pageIndex;
    this.fetchData();
  }

  isItemValidForPayment(created_at: string): boolean {
    const currentTime = new Date();
    const itemTime = new Date(created_at);
    const timeDifference = currentTime.getTime() - itemTime.getTime();
    const halfHourInMilliseconds = 30 * 60 * 1000;
    return timeDifference < halfHourInMilliseconds;
  }
}
