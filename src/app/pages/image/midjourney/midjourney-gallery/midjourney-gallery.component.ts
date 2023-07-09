import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap, shareReplay } from 'rxjs/operators';
import { ImageService } from 'src/app/services/image.service';

@Component({
  selector: 'app-midjourney-gallery',
  templateUrl: './midjourney-gallery.component.html',
  styleUrls: ['./midjourney-gallery.component.scss'],
})
export class MidjourneyGalleryComponent implements OnInit {
  items$: Observable<any>;
  currentPage = 0;
  itemsPerPage = 12;
  totalItems = 0;

  constructor(private router: Router, private imageService: ImageService) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    const page = this.currentPage + 1;
    const perPage = this.itemsPerPage;

    this.items$ = this.imageService
      .listGenerationsMidjourney(page, perPage)
      .pipe(
        tap((response: any) => {
          this.totalItems = response.meta.total;
        }),
        shareReplay(1)
      );
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
