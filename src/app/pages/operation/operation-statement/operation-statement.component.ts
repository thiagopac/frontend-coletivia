import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap, shareReplay } from 'rxjs';
import { OperationService } from 'src/app/services/operation.service';

@Component({
  selector: 'app-operation-statement',
  templateUrl: './operation-statement.component.html',
  styleUrls: ['./operation-statement.component.scss'],
})
export class OperationStatementComponent implements OnInit {
  items$: Observable<any>;
  currentPage = 0;
  itemsPerPage = 10;
  totalItems = 0;
  constructor(
    private operationService: OperationService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    const page = this.currentPage + 1;
    const perPage = this.itemsPerPage;

    this.items$ = this.operationService.listOperations(page, perPage).pipe(
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
}
