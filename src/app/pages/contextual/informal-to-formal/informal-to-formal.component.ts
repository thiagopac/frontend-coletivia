import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertMessageService } from 'src/app/services/alert-message.service';
import { ContextualService } from 'src/app/services/contextual.service';
import { ConversationalService } from 'src/app/services/conversational.service';
import { InsufficientBalanceService } from 'src/app/services/insufficient-balance.service';

@Component({
  selector: 'app-informal-to-formal',
  templateUrl: './informal-to-formal.component.html',
  styleUrls: ['./informal-to-formal.component.scss'],
})
export class InformalToFormalComponent implements OnInit, OnDestroy {
  @ViewChild('textarea', { read: ElementRef })
  textarea: ElementRef<HTMLTextAreaElement>;
  transcriptInput: string = '';
  transcriptOutput: string = 'Seu texto aparecerá aqui';
  mostrarBloqueio: boolean = false;
  subBloqueio: Subscription;

  constructor(
    private contextualService: ContextualService,
    private conversationaService: ConversationalService,
    private changeDetectorRef: ChangeDetectorRef,
    private alertMessageService: AlertMessageService,
    private insufficientBalanceService: InsufficientBalanceService
  ) {}

  ngOnInit(): void {
    this.subBloqueio = this.insufficientBalanceService.bloqueio$
      .asObservable()
      .subscribe((bloqueio) => {
        this.mostrarBloqueio = bloqueio;
      });
  }

  setTextareaHeight() {
    this.textarea.nativeElement.style.height = `50px`;
    const scrollHeight = this.textarea.nativeElement.scrollHeight;
    this.textarea.nativeElement.style.height = `${scrollHeight}px`;
  }

  transcript() {
    if (this.mostrarBloqueio) {
      this.alertMessageService.insufficientBalanceAlert();
    } else {
      this.contextualService
        .createChatInformalToFormal()
        .subscribe((chatRes) => {
          this.conversationaService
            .chatMessage(chatRes.uuid, this.transcriptInput)
            .subscribe((messageRes) => {
              this.transcriptOutput = messageRes.result.content;
              this.changeDetectorRef.detectChanges();
            });
        });
    }
  }

  ngOnDestroy(): void {
    this.subBloqueio.unsubscribe();
  }

  // selectFirst(first: string) {
  //   this.selectedModel = first;
  // }
}
