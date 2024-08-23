import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentAnalysisService } from 'src/app/services/document-analysis.service';

@Component({
  selector: 'app-document-analysis',
  templateUrl: './document-analysis.component.html',
  styleUrls: ['./document-analysis.component.scss'],
})
export class DocumentAnalysisComponent implements OnInit, OnDestroy {
  analysisUuid: string;
  analysis?: any;
  analysisContent?: any[];

  speechSynthesis: SpeechSynthesis;
  speaking: boolean = false;
  paused: boolean = false;
  currentMessage: SpeechSynthesisUtterance | null = null;
  availableVoices: SpeechSynthesisVoice[] = [];
  selectedVoice: SpeechSynthesisVoice | null = null;
  availableRates: number[] = [0.5, 0.75, 1, 1.25, 1.5];
  selectedRate: number = 1;

  private voicesLoadedInterval: any;

  constructor(
    private documentAnalysisService: DocumentAnalysisService,
    private changeDetectorRef: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.analysisUuid = params.get('uuid')!;
      this.loadDocumentAnalysis(this.analysisUuid);
    });

    this.speechSynthesis = window.speechSynthesis;

    if ('speechSynthesis' in window) {
      this.selectedRate = 1;
      this.loadVoices();
    }
  }

  loadVoices() {
    this.voicesLoadedInterval = setInterval(() => {
      const voices = this.speechSynthesis.getVoices();
      if (voices.length !== 0) {
        this.availableVoices = voices;
        this.selectedVoice =
          this.availableVoices.find((voice) => voice.lang === 'pt-BR') || null;
        this.changeDetectorRef.detectChanges();
        clearInterval(this.voicesLoadedInterval);
      }
    }, 100);
  }

  loadDocumentAnalysis(uuid: string) {
    this.documentAnalysisService.retrieve(uuid).subscribe((res) => {
      this.analysis = res;
      this.analysisContent = res.content;
      this.changeDetectorRef.detectChanges();
    });
  }

  replace(str: string) {
    return str.replace('_', ' ');
  }

  replaceNewLinesWithBreaks(text: string): string {
    let formattedText = text.replace(/\n/g, '<br>');

    const keywordIndex = formattedText.indexOf('Palavras-chave:');

    if (keywordIndex !== -1) {
      formattedText =
        formattedText.substring(0, keywordIndex) +
        '<p class="mt-5"><strong>' +
        formattedText.substring(keywordIndex) +
        '</strong><p>';
    }

    return formattedText;
  }

  toggleSpeech(text: string): void {
    if ('speechSynthesis' in window) {
      if (this.speaking && !this.paused) {
        this.speechSynthesis.pause();
        this.paused = true;
      } else if (this.speaking && this.paused) {
        this.speechSynthesis.resume();
        this.paused = false;
      } else {
        const message = new SpeechSynthesisUtterance(text);
        message.voice = this.selectedVoice;
        message.rate = this.selectedRate;

        this.speaking = true;
        this.paused = false;
        this.currentMessage = message;

        message.onend = () => {
          this.speaking = false;
          this.paused = false;
          this.currentMessage = null;
        };

        this.speechSynthesis.speak(message);
      }
    } else {
      alert('A síntese de fala não é suportada neste navegador.');
    }
  }

  stopSpeech(): void {
    if ('speechSynthesis' in window && this.speaking) {
      this.speechSynthesis.cancel();
      this.speaking = false;
      this.paused = false;
      this.currentMessage = null;
    }
  }

  updateVoice(): void {
    if (this.selectedVoice && this.speaking) {
      this.speechSynthesis.cancel();
      this.speaking = false;
      this.paused = false;
      this.currentMessage = null;
    }
  }

  updateRate(): void {
    if (this.speaking) {
      this.currentMessage!.rate = this.selectedRate;
      this.speechSynthesis.cancel();
      this.speaking = false;
      this.paused = false;
      this.speechSynthesis.speak(this.currentMessage!);
    }
  }

  ngOnDestroy(): void {
    if ('speechSynthesis' in window) {
      this.speechSynthesis.cancel();
      this.speaking = false;
    }
    if (this.voicesLoadedInterval) {
      clearInterval(this.voicesLoadedInterval);
    }
  }

  stringContains(string: string, substring: string): boolean {
    if (!string) return false;
    return string.includes(substring);
  }
}
