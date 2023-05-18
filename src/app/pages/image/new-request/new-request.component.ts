import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ImageService } from 'src/app/services/image.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-new-request',
  templateUrl: './new-request.component.html',
  styleUrls: ['./new-request.component.scss'],
})
export class NewRequestComponent implements OnInit {
  prompt: string = '';
  imageSize: string = '1024x1024';
  nVariations: number = 1;
  isAccordionOpen = false;
  imageGenerationUuid: string = '';
  public imageUrls: string[] = [];
  public fullSizeImageUrl: SafeUrl | undefined;

  exemplos: { prompt: string; descricaoIdeal: string }[] = [
    {
      prompt: 'Um elefante rosa dançando em cima de um balão azul.',
      descricaoIdeal:
        'Elefante realista com uma cor rosa vibrante e um balão azul nítido, com o elefante em uma pose de dança alegre.',
    },
    {
      prompt:
        'Uma paisagem futurista com arranha-céus brilhantes e carros voadores.',
      descricaoIdeal:
        'Uma cidade futurista com arranha-céus altos e brilhantes, ruas movimentadas com carros voadores e uma atmosfera noturna com luzes vibrantes.',
    },
    {
      prompt: 'Um lindo gato preto com olhos amarelos brilhantes.',
      descricaoIdeal:
        'Um gato preto de pelagem brilhante e sedosa, com olhos amarelos intensos, em uma pose elegante e expressão felina.',
    },
    {
      prompt: 'Um jardim encantado com flores luminosas e uma cascata mágica.',
      descricaoIdeal:
        'Um jardim exuberante e colorido, com flores brilhantes em tons vibrantes e uma cascata com água cristalina caindo suavemente em meio a um cenário mágico.',
    },
    {
      prompt:
        'Uma floresta encantada com árvores gigantes e cogumelos coloridos.',
      descricaoIdeal:
        'Uma floresta densa e misteriosa, com árvores imponentes e folhagem exuberante, além de cogumelos coloridos e encantadores espalhados pelo chão.',
    },
    {
      prompt: 'Um pôr do sol tranquilo em uma praia deserta.',
      descricaoIdeal:
        'Uma praia serena e isolada, com um pôr do sol dourado refletindo suavemente nas águas calmas do oceano, criando uma atmosfera tranquila.',
    },
    {
      prompt: 'Um castelo medieval majestoso cercado por montanhas imponentes.',
      descricaoIdeal:
        'Um castelo imponente, com torres altas e ameias detalhadas, situado em um cenário montanhoso dramático, criando uma sensação de grandeza e mistério.',
    },
    {
      prompt: 'Uma festa animada com pessoas dançando em trajes extravagantes.',
      descricaoIdeal:
        'Uma festa vibrante e animada, com pessoas dançando e se divertindo, vestindo trajes exuberantes e coloridos, com expressões alegres e movimentos dinâmicos.',
    },
    {
      prompt: 'Um avião espacial futurista voando pelo espaço sideral.',
      descricaoIdeal:
        'Uma nave espacial futurista com um design elegante, navegando pelo espaço sideral repleto de estrelas brilhantes, com um rastro de propulsão luminoso.',
    },
    {
      prompt:
        'Um jardim zen tranquilo com uma ponte de pedra sobre um lago sereno.',
      descricaoIdeal:
        'Um jardim japonês sereno, com um lago calmo e límpido, uma ponte de pedra suave e vegetação verdejante, criando uma atmosfera de paz e equilíbrio.',
    },
  ];

  constructor(
    private imageService: ImageService,
    private changeDetectorRef: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {}

  generate(): void {
    this.imageService
      .createImageGeneration(this.prompt, this.imageSize, this.nVariations)
      .subscribe((response) => {
        this.imageGenerationUuid = response.uuid;
        const arrData = JSON.parse(response.images).images.data;
        for (const data of arrData) {
          this.imageUrls.push(data.url);
        }
        this.changeDetectorRef.detectChanges();
      });
  }

  toggleAccordion(): void {
    this.isAccordionOpen = !this.isAccordionOpen;
  }

  showFullSizeImage(url: string) {
    this.fullSizeImageUrl = this.sanitizer.bypassSecurityTrustUrl(url);
  }

  closeFullSizeImage() {
    this.fullSizeImageUrl = undefined;
  }
}
