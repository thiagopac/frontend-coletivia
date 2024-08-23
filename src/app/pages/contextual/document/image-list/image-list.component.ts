import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AlertMessageService } from 'src/app/services/alert-message.service';
import { ImageService } from 'src/app/services/image.service';

@Component({
  selector: 'app-image-list',
  templateUrl: './image-list.component.html',
  styleUrls: ['./image-list.component.scss'],
})
export class ImageListComponent implements OnInit {
  items$: Observable<any[]>;

  constructor(
    private router: Router,
    private imageService: ImageService,
    private alertMessageService: AlertMessageService
  ) {}

  ngOnInit(): void {
    this.list();
  }

  list(): void {
    this.items$ = this.imageService.list();
  }

  goTo(route: string, uuid?: string): void {
    if (uuid) this.router.navigate([route, uuid]);
    else this.router.navigate([route]);
  }

  confirmDelete(uuid: string): void {
    this.alertMessageService.alertWithHandler(`Tem certeza?`, 'question', () =>
      this.delete(uuid)
    );
  }

  delete(uuid: string): void {
    this.imageService.delete(uuid).subscribe(() => {
      this.list();
    });
  }
}
