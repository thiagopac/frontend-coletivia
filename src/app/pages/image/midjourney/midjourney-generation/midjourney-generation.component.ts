import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ImageService } from 'src/app/services/image.service';

@Component({
  selector: 'app-midjourney-generation',
  templateUrl: './midjourney-generation.component.html',
  styleUrls: ['./midjourney-generation.component.scss'],
})
export class MidjourneyGenerationComponent implements OnInit {
  generationUuid?: string;
  generation?: any;
  public fullSizeImageUrl: SafeUrl | undefined;

  constructor(
    private imageService: ImageService,
    private activatedRoute: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.generationUuid = params.get('uuid')!;
      this.loadGenerationResources(this.generationUuid);
    });
  }

  loadGenerationResources(uuid: string) {
    this.imageService.retrieveGenerationMidjourney(uuid).subscribe((res) => {
      this.generation = res;
      this.changeDetectorRef.detectChanges();
    });
  }

  confirmUpscale(option: number, index: number): void {
    if (confirm(`Criar versão em alta resolução da opção ${index}?`)) {
      this.upscale(option, index);
    }
  }

  upscale(option: number, index: number) {
    this.imageService
      .createUpscaleMidjourney(this.generationUuid!, option, index)
      .subscribe({
        next: (res) => {
          this.loadGenerationResources(this.generationUuid!);
          this.changeDetectorRef.detectChanges();
          const element = document.getElementById('hd-images');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  showFullSizeImage(url: string) {
    this.fullSizeImageUrl = this.sanitizer.bypassSecurityTrustUrl(url);
  }

  closeFullSizeImage() {
    this.fullSizeImageUrl = undefined;
  }

  downloadImage(uri: string, number: number) {
    const prompt = this.generation?.prompt;
    const truncatedPrompt = prompt
      ? prompt.slice(0, 60).replace(/\s/g, '-')
      : '';
    const title = `${truncatedPrompt}-${number}`;

    fetch(uri)
      .then((response) => response.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${title}.png`;
        link.click();
        URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.log('Erro ao baixar a imagem:', error);
      });
  }
}
