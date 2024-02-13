import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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

  constructor(
    private instagramService: InstagramService,
    private activatedRoute: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.generationUuid = params.get('uuid')!;
      this.loadGenerationResources(this.generationUuid);
    });
  }

  refreshEventReceived() {
    this.loadGenerationResources(this.generationUuid!);
  }

  loadGenerationResources(uuid: string) {
    this.images = [];
    this.instagramService.retrieveInstagramPost(uuid).subscribe((res) => {
      this.instagramPost = res;
      this.changeDetectorRef.detectChanges();
    });
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
  }

  getContentStyles() {
    return {
      'content-expanded': this.expanded,
      'content-collapsed': !this.expanded,
    };
  }
}
