import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ImageService } from 'src/app/services/image.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-midjourney-create',
  templateUrl: './midjourney-create.component.html',
  styleUrls: ['./midjourney-create.component.scss'],
})
export class MidjourneyCreateComponent implements OnInit {
  prompt: string = '';
  isAccordionOpen = false;
  translate: boolean = true;

  exemplos: { prompt: string; descricaoIdeal: string }[] = [
    {
      prompt: 'Um elefante rosa dançando em cima de um balão azul.',
      descricaoIdeal:
        'Elefante rosa em estilo ilustrativo, com cor vibrante e detalhes sutis de sombreamento. O balão azul tem uma aparência suave e brilhante, com reflexos de luz destacando sua superfície.',
    },
    {
      prompt:
        'Uma paisagem futurista com arranha-céus brilhantes e carros voadores.',
      descricaoIdeal:
        'Ilustração de uma cidade futurista com arranha-céus altos e brilhantes, utilizando cores vibrantes para criar um efeito de luminosidade. Os carros voadores têm um design aerodinâmico e são representados com traços nítidos.',
    },
    {
      prompt: 'Um lindo gato preto com olhos amarelos brilhantes.',
      descricaoIdeal:
        'Ilustração de um gato preto com pelagem lustrosa e detalhes sutis de luz e sombra para destacar sua textura. Os olhos amarelos são intensos e brilhantes, transmitindo uma sensação de alerta e mistério.',
    },
    {
      prompt: 'Um jardim encantado com flores luminosas e uma cascata mágica.',
      descricaoIdeal:
        'Ilustração de um jardim com cores vivas e vibrantes, destacando flores em tons luminosos, como vermelho, rosa e amarelo. A cascata é representada com movimento suave e água cristalina, proporcionando um toque mágico ao cenário.',
    },
    {
      prompt:
        'Uma floresta encantada com árvores gigantes e cogumelos coloridos.',
      descricaoIdeal:
        'Ilustração de uma floresta densa e misteriosa, com árvores altas e imponentes em tons de verde profundo. Os cogumelos coloridos são representados com detalhes vivos, criando um contraste encantador com o ambiente sombrio.',
    },
    {
      prompt: 'Um pôr do sol tranquilo em uma praia deserta.',
      descricaoIdeal:
        'Ilustração de uma praia deserta com um pôr do sol dourado, utilizando tons quentes de laranja e rosa para criar uma atmosfera serena. As águas calmas do oceano refletem suavemente as cores do céu, transmitindo tranquilidade.',
    },
    {
      prompt: 'Um castelo medieval majestoso cercado por montanhas imponentes.',
      descricaoIdeal:
        'Ilustração de um castelo medieval com torres imponentes e detalhes arquitetônicos refinados. As montanhas ao redor são representadas com traços fortes e sombras sutis, criando uma sensação de grandiosidade e majestade.',
    },
    {
      prompt: 'Uma festa animada com pessoas dançando em trajes extravagantes.',
      descricaoIdeal:
        'Ilustração de uma festa com pessoas dançando e se divertindo, usando trajes coloridos e exuberantes. As expressões faciais são expressivas, transmitindo alegria e movimento. Os detalhes dos trajes destacam tecidos brilhantes e estampas chamativas.',
    },
    {
      prompt: 'Um avião espacial futurista voando pelo espaço sideral.',
      descricaoIdeal:
        'Ilustração de uma nave espacial futurista com design elegante e linhas aerodinâmicas. O espaço sideral é representado com estrelas brilhantes em um fundo escuro, e o avião espacial emite um rastro de propulsão luminoso, ressaltando seu movimento.',
    },
    {
      prompt:
        'Um jardim zen tranquilo com uma ponte de pedra sobre um lago sereno.',
      descricaoIdeal:
        'Ilustração de um jardim zen japonês com uma ponte de pedra suave e natural que atravessa um lago calmo. O lago é representado com cores sutis e reflexos suaves, enquanto a vegetação é retratada com traços suaves e delicados, criando uma atmosfera de serenidade e equilíbrio.',
    },
  ];

  constructor(private imageService: ImageService, private router: Router) {}

  ngOnInit(): void {}

  generate(): void {
    this.imageService
      .createGenerationMidjourney(this.prompt, this.translate)
      .subscribe((res) => {
        this.router.navigate(['/image/midjourney/generation', res.uuid]);
      });
  }

  toggleAccordion(): void {
    this.isAccordionOpen = !this.isAccordionOpen;
  }
}
