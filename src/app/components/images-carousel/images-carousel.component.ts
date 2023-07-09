import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-images-carousel',
  templateUrl: './images-carousel.component.html',
  styleUrls: ['./images-carousel.component.scss'],
})
export class ImagesCarouselComponent {
  @Input() createdAt: string;
  @Input() images: string[];
  currentIndex = 0;
  public fullSizeImageUrl: SafeUrl | undefined;
  constructor(private sanitizer: DomSanitizer) {}

  nextImage() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  previousImage() {
    this.currentIndex =
      (this.currentIndex - 1 + this.images.length) % this.images.length;
  }

  goToImage(index: number) {
    this.currentIndex = index;
  }

  showFullSizeImage(url: string) {
    this.fullSizeImageUrl = this.sanitizer.bypassSecurityTrustUrl(url);
  }

  closeFullSizeImage() {
    this.fullSizeImageUrl = undefined;
  }
}
