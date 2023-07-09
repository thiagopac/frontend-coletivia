import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { InstagramService } from 'src/app/services/instagram.service';

@Component({
  selector: 'app-instagram-view',
  templateUrl: './instagram-view.component.html',
  styleUrls: ['./instagram-view.component.scss'],
})
export class InstagramViewComponent implements OnInit {
  generationUuid?: string;
  instagramPost?: any;
  images: string[] = [];
  expanded = false;
  maxHeight = '0px';

  public fullSizeImageUrl: SafeUrl | undefined;

  constructor(
    private instagramService: InstagramService,
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
    this.images = [];
    this.instagramService.retrieveInstagramPost(uuid).subscribe((res) => {
      this.instagramPost = res;
      this.changeDetectorRef.detectChanges();
    });
  }

  confirmUpscale(option: number, index: number): void {
    if (confirm(`Criar versão em alta resolução da opção ${index}?`)) {
      this.upscale(option, index);
    }
  }

  upscale(option: number, index: number) {
    this.instagramService
      .upscaleImageInstagramPost(this.generationUuid!, option, index)
      .subscribe({
        next: (res) => {
          this.loadGenerationResources(this.generationUuid!);
          this.toggleContent();
          this.changeDetectorRef.detectChanges();
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
    const prompt = this.instagramPost.midjourneyImageGeneration?.prompt;
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

  toggleContent() {
    this.expanded = !this.expanded;
    this.maxHeight = this.expanded ? '100%' : '0px'; // Ajuste a altura máxima conforme necessário
  }

  getContentStyles() {
    return {
      'max-height': this.maxHeight,
      opacity: this.expanded ? '1' : '0',
      transition: 'max-height 0.3s ease-in-out, opacity 0.3s ease-in-out',
    };
  }
}
