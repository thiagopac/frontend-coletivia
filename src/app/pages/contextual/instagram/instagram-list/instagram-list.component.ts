import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { InstagramService } from 'src/app/services/instagram.service';
import { shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-instagram-list',
  templateUrl: './instagram-list.component.html',
  styleUrls: ['./instagram-list.component.scss'],
})
export class InstagramListComponent implements OnInit {
  items$: Observable<any>;
  currentPage = 0;
  itemsPerPage = 12;
  totalItems = 0;

  constructor(
    private instagramService: InstagramService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    const page = this.currentPage + 1;
    const perPage = this.itemsPerPage;

    if (!this.items$) {
      this.items$ = this.instagramService
        .listInstagramPosts(page, perPage)
        .pipe(shareReplay(1));

      this.items$.subscribe((response: any) => {
        this.totalItems = response.meta.total;
      });
    }
  }

  goTo(route: string, uuid?: string): void {
    if (uuid) {
      this.router.navigate([route, uuid]);
    } else {
      this.router.navigate([route]);
    }
  }

  goToPage(event: any): void {
    this.itemsPerPage = event.pageSize;
    this.currentPage = event.pageIndex;
    this.fetchData();
  }
}
