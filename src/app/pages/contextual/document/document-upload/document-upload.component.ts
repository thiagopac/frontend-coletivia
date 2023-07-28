import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DocumentService } from 'src/app/services/document.service';
import { ModelService } from 'src/app/services/model.service';

@Component({
  selector: 'app-document-upload',
  templateUrl: './document-upload.component.html',
  styleUrls: ['./document-upload.component.scss'],
})
export class DocumentUploadComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;

  models$: Observable<any[]>;
  selectedModel: string;
  transcriptInput: string = '';
  transcriptOutput: string = 'Seu texto aparecerá aqui';

  constructor(
    private modelService: ModelService,
    private documentService: DocumentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.models$ = this.modelService.listForType('text');
  }

  selectFirst(first: string) {
    this.selectedModel = first;
  }

  selectFile(): void {
    this.fileInput.nativeElement.click();
  }

  createDocumentAndSend(file: File): void {
    // Criar o documento
    this.documentService.create(this.selectedModel, file.type).subscribe(
      (response) => {
        const documentUuid = response.uuid;
        console.log('Documento criado:', documentUuid);

        // Enviar o arquivo
        this.documentService.sendFile(documentUuid, file).subscribe(
          (res) => {
            this.router.navigate(['/contextual/document/resume', res.uuid]);
          },
          (error) => {
            console.error('Erro ao enviar o arquivo:', error);
          }
        );
      },
      (error) => {
        console.error('Erro ao criar o documento:', error);
      }
    );
  }
}
