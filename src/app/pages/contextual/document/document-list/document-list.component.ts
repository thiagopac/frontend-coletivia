import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AlertMessageService } from 'src/app/services/alert-message.service';
import { DocumentService } from 'src/app/services/document.service';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.scss'],
})
export class DocumentListComponent implements OnInit {
  items$: Observable<any[]>;

  constructor(
    private router: Router,
    private documentService: DocumentService,
    private alertMessageService: AlertMessageService
  ) {}

  ngOnInit(): void {
    this.list();
  }

  list(): void {
    this.items$ = this.documentService.list();
  }

  goTo(route: string, uuid?: string): void {
    if (uuid) this.router.navigate([route, uuid]);
    else this.router.navigate([route]);
    // window.location.href = `/contextual/document/resume/${uuid}`;
  }

  confirmDelete(uuid: string): void {
    this.alertMessageService.alertWithHandler(`Tem certeza?`, 'question', () =>
      this.delete(uuid)
    );
  }

  delete(uuid: string): void {
    this.documentService.delete(uuid).subscribe((res) => {
      this.list();
    });
  }
}
