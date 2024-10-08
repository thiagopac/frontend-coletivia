import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { AlertMessageService } from 'src/app/services/alert-message.service';
import { ImageService } from 'src/app/services/image.service';
import { InstagramService } from 'src/app/services/instagram.service';
import { InsufficientBalanceService } from 'src/app/services/insufficient-balance.service';

@Component({
  selector: 'app-image-options-grid',
  templateUrl: './image-options-grid.component.html',
  styleUrls: ['./image-options-grid.component.scss'],
})
export class ImageOptionsGridComponent implements OnInit {
  @Input() instagramPost?: any = undefined;
  @Input() generation: any;
  @Output() refreshEvent = new EventEmitter();

  maxHeight = '0px';
  public fullSizeImageUrl: SafeUrl | undefined;
  mostrarBloqueio: boolean = false;
  subBloqueio: Subscription;

  constructor(
    private alertMessageService: AlertMessageService,
    private instagramService: InstagramService,
    private imageService: ImageService,
    private changeDetectorRef: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private insufficientBalanceService: InsufficientBalanceService
  ) {}

  ngOnInit(): void {
    this.subBloqueio = this.insufficientBalanceService.bloqueio$
      .asObservable()
      .subscribe((bloqueio) => {
        this.mostrarBloqueio = bloqueio;
      });
  }

  confirmUpscale(option: number, index: number): void {
    this.alertMessageService.alertWithHandler(
      `Criar versão em alta resolução da <strong>Opção ${index}</strong>?`,
      'question',
      this.instagramPost
        ? () => this.upscaleInstagram(option, index)
        : () => this.upscale(option, index),
      true
    );
  }

  upscale(option: number, index: number) {
    if (this.mostrarBloqueio) {
      this.alertMessageService.insufficientBalanceAlert();
    } else {
      this.imageService
        .createUpscaleMidjourney(this.generation.uuid!, option, index)
        .subscribe({
          next: (res) => {
            this.refreshEvent.emit();
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
  }

  upscaleInstagram(option: number, index: number) {
    if (this.mostrarBloqueio) {
      this.alertMessageService.insufficientBalanceAlert();
    } else {
      this.instagramService
        .upscaleImageInstagramPost(this.instagramPost.uuid!, option, index)
        .subscribe({
          next: (res) => {
            this.refreshEvent.emit();
            this.changeDetectorRef.detectChanges();
          },
          error: (err) => {
            console.log(err);
          },
        });
    }
  }

  showFullSizeImage(url: string) {
    this.fullSizeImageUrl = this.sanitizer.bypassSecurityTrustUrl(url);
  }

  closeFullSizeImage() {
    this.fullSizeImageUrl = undefined;
  }
}
