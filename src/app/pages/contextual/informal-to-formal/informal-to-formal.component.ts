import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { Observable } from 'rxjs';
import { ContextualService } from 'src/app/services/contextual.service';
import { ConversationalService } from 'src/app/services/conversational.service';
import { ModelService } from 'src/app/services/model.service';

@Component({
  selector: 'app-informal-to-formal',
  templateUrl: './informal-to-formal.component.html',
  styleUrls: ['./informal-to-formal.component.scss'],
})
export class InformalToFormalComponent implements OnInit {
  // nVariations: number = 1;
  @ViewChild('textarea', { read: ElementRef })
  textarea: ElementRef<HTMLTextAreaElement>;

  models$: Observable<any[]>;
  selectedModel: string;
  transcriptInput: string = '';
  transcriptOutput: string = 'Seu texto aparecerá aqui';

  constructor(
    private modelService: ModelService,
    private contextualService: ContextualService,
    private conversationaService: ConversationalService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.models$ = this.modelService.getChatModelListForType('text');
  }

  setTextareaHeight() {
    this.textarea.nativeElement.style.height = `50px`;
    const scrollHeight = this.textarea.nativeElement.scrollHeight;
    this.textarea.nativeElement.style.height = `${scrollHeight}px`;
  }

  transcript() {
    this.contextualService
      .createChatInformalToFormal(this.selectedModel)
      .subscribe((chatRes) => {
        this.conversationaService
          .chatMessage(chatRes.uuid, this.transcriptInput)
          .subscribe((messageRes) => {
            this.transcriptOutput = messageRes.result.content;
            this.changeDetectorRef.detectChanges();
          });
      });
  }

  selectFirst(first: string) {
    this.selectedModel = first;
  }
}