import { Component, OnInit } from '@angular/core';

export interface Feature {
  name: string;
  icon: string;
  availability: string;
  profiles: FeatureProfile[];
}

export interface FeatureProfile {
  name: string;
  availability: string;
}

@Component({
  selector: 'app-available-features',
  templateUrl: './available-features.component.html',
  styleUrls: ['./available-features.component.scss'],
})
export class AvailableFeaturesComponent implements OnInit {
  chatGPT: Feature = {
    name: 'ChatGPT',
    icon: './assets/media/svg/coletivia/chatgpt.svg',
    profiles: [
      {
        name: 'GPT-3.5',
        availability: 'Disponível',
      },
      {
        name: 'GPT-4',
        availability: 'Disponível',
      },
    ],
  } as Feature;

  whisper: Feature = {
    name: 'Whisper',
    icon: './assets/media/svg/coletivia/whisper.svg',
    profiles: [
      {
        name: 'Whisper 1',
        availability: 'Em breve',
      },
    ],
  } as Feature;

  dallE: Feature = {
    name: 'DALL·E',
    icon: './assets/media/svg/coletivia/dall-e.svg',
    profiles: [
      {
        name: 'DALL·E 2',
        availability: 'Disponível',
      },
    ],
  } as Feature;

  midjourney: Feature = {
    name: 'Midjourney',
    icon: './assets/media/svg/coletivia/midjourney.svg',
    profiles: [
      {
        name: 'Midjourney',
        availability: 'Disponível',
      },
    ],
  } as Feature;

  featureList: Feature[] = [];

  selectedFeature: Feature = {} as Feature;

  constructor() {}

  ngOnInit(): void {
    this.featureList.push(this.chatGPT);
    this.featureList.push(this.midjourney);
    // this.featureList.push(this.dallE);
    // this.featureList.push(this.whisper);
    this.selectedFeature = this.featureList[0];
  }
}
