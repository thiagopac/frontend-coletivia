import { Component, Input, OnChanges, OnInit } from '@angular/core';
import * as JSZip from 'jszip';

@Component({
  selector: 'app-instagram-feed-item',
  templateUrl: './instagram-feed-item.component.html',
  styleUrls: ['./instagram-feed-item.component.scss'],
})
export class InstagramFeedItemComponent implements OnInit, OnChanges {
  @Input() instagramPost?: any;
  images: string[] = [];

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(): void {
    this.images = [];
    if (this.instagramPost) {
      for (const upscale of this.instagramPost.midjourneyImageGeneration
        ?.upscales.upscales) {
        this.images.push(upscale.uri);
      }
    }
  }

  downloadFiles() {
    const zip = new JSZip();

    if (this.images.length === 0) {
      const textContent = this.instagramPost?.aiWriting?.text;
      zip.file('legenda.txt', textContent);

      zip.generateAsync({ type: 'blob' }).then((content) => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = 'Coletivia_post_instagram.zip';
        link.click();
      });
      return; // Encerra a função, pois não há imagens para processar.
    }

    let completedCount = 0; // Contador de imagens processadas.

    for (let i = 0; i < this.images.length; i++) {
      const image = this.images[i];
      const imageName = `imagem${i + 1}.jpg`;

      fetch(image)
        .then((response) => response.blob())
        .then((blob) => {
          zip.file(imageName, blob);

          completedCount++;

          if (completedCount === this.images.length) {
            const textContent = this.instagramPost?.aiWriting?.text;
            zip.file('legenda.txt', textContent);

            zip.generateAsync({ type: 'blob' }).then((content) => {
              const link = document.createElement('a');
              link.href = URL.createObjectURL(content);
              link.download = 'Coletivia_post_instagram.zip';
              link.click();
            });
          }
        });
    }
  }

  replaceNewLinesWithBreaks(text: string): string {
    return text.replace(/\n/g, '<br>');
  }
}
