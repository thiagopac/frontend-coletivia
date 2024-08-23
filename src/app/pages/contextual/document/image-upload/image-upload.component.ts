import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ImageService } from 'src/app/services/image.service';
import { ModelService } from 'src/app/services/model.service';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss'],
})
export class ImageUploadComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;

  models$: Observable<any[]>;
  selectedModel: string;
  transcriptInput: string = '';
  transcriptOutput: string = 'Seu texto aparecerá aqui';

  constructor(
    private modelService: ModelService,
    private imageService: ImageService,
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

  createImageAndSend(file: File): void {
    // Cria o registro da imagem e faz o upload do arquivo
    this.imageService.createAndSend(this.selectedModel, file).subscribe(
      (response) => {
        const imageUuid = response.uuid;
        console.log('Imagem criada e enviada:', imageUuid);

        // Redireciona para a página de resumo da imagem
        this.router.navigate(['/contextual/image/resume', imageUuid]);
      },
      (error) => {
        console.error('Erro ao criar e enviar a imagem:', error);
      }
    );
  }
}
