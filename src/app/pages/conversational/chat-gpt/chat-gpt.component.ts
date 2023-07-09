import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { ChatMessage } from 'src/app/models/chat-response';
import { ChatService } from 'src/app/services/chat.service';
import { ConversationalService } from 'src/app/services/conversational.service';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

@Component({
  selector: 'app-chat-gpt',
  templateUrl: './chat-gpt.component.html',
  styleUrls: ['./chat-gpt.component.scss'],
  animations: [
    trigger('brilhoTexto', [
      state('normal', style({ color: 'black', textShadow: 'none' })),
      state('brilhando', style({ color: 'blue', textShadow: '0 0 5px blue' })),
      transition('normal <=> brilhando', animate('500ms ease-in-out')),
    ]),
  ],
})
export class ChatGptComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('textarea', { read: ElementRef })
  textarea: ElementRef<HTMLTextAreaElement>;
  @ViewChild('placeholder', { read: ElementRef })
  placeholder: ElementRef<HTMLDivElement>;
  @ViewChild('messageContainer') messageContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('messageWrapper', { read: ElementRef })
  messageWrapper!: ElementRef<HTMLDivElement>;

  //chat
  chatUuid: string;
  messages: ChatMessage[] = [];
  chatTitle: string = 'Nova conversa';
  errMessage: string = '';
  chatInput: string;
  chatInputPersistent: string;

  chatIndex: number;
  savedIndex: number;
  hoverIndex: number;

  haveError: boolean = false;

  genStart: boolean = false;
  genPendding: boolean = false;

  destroy$ = new Subject<void>();

  chatList: any[] = [];
  estadoAnimacao: boolean = false;
  showContinueButton: boolean = false;

  constructor(
    private conversationalService: ConversationalService,
    private chatService: ChatService,
    private changeDetectorRef: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.chatUuid = params.get('uuid')!;
      this.loadChatResources(this.chatUuid);
    });
  }

  loadChatResources(chatUuid: string) {
    this.chatService.getChatWithMessages(chatUuid).subscribe((res) => {
      this.chatTitle = res.title;
      this.messages = res.messages.messages;
      this.changeDetectorRef.detectChanges();
    });

    this.chatService.listForType('free-chat').subscribe((res) => {
      this.chatList = res;
    });
  }

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  ngOnDestroy(): void {
    this.stop();
    this.destroy$.next();
    this.destroy$.complete();
  }

  enter(e: KeyboardEvent) {
    e.key === 'Enter' ? this.startChat() : void 0;
  }

  preventEnter(e: KeyboardEvent) {
    e.key === 'Enter' ? e.preventDefault() : void 0;
  }

  setTextareaHeight() {
    this.textarea.nativeElement.style.height = `50px`;
    this.placeholder.nativeElement.style.height = '50px';
    const scrollHeight = this.textarea.nativeElement.scrollHeight;
    this.textarea.nativeElement.style.height = `${scrollHeight}px`;
    this.placeholder.nativeElement.style.height = `${scrollHeight + 115}px`;
  }

  startChat() {
    const canChat = !this.genPendding && this.chatInput && !this.haveError;
    if (!canChat) return;
    this.messages.push({ role: 'user', content: this.chatInput });
    this.clearInput();
    this.genStart = true;
    this.genPendding = true;
    this.conversationalService.isStream
      ? this.chatStream(this.chatInputPersistent)
      : this.chat(this.chatInputPersistent);
  }

  clearInput() {
    this.chatInputPersistent = this.chatInput;
    this.chatInput = '';
    this.textarea.nativeElement.style.height = `50px`;
    this.placeholder.nativeElement.style.height = '100px';
  }

  chat(prompt: string) {
    this.conversationalService.chatMessage(this.chatUuid, prompt).subscribe({
      next: (res: any) => {
        this.genStart = false;
        this.genPendding = false;
        const msg = res.choices[0].message ?? {
          role: 'assistant',
          content: 'err',
        };
      },
      error: (errMsg: string) => {
        console.log('errMsg: ', errMsg);
        this.genStart = false;
        this.genPendding = false;
        this.haveError = true;
        this.errMessage = errMsg;
      },
    });
  }

  chatStream(prompt: string) {
    this.scrollToBottom();
    this.conversationalService.chatStream(this.chatUuid, prompt).subscribe({
      next: (obs: any) => {
        if (obs.finishReason === 'length') this.showContinueButton = true;
        const message = this.messages;
        const lastMsg = message[message.length - 1];
        if (lastMsg.role === 'user') {
          this.genStart = false;
          message.push({ role: 'assistant', content: obs.content });
        } else {
          lastMsg.content += obs.content;
        }
        this.changeDetectorRef.detectChanges();
      },
      complete: () => {
        console.log(this.messages.length);

        if (this.messages.length === 2) {
          this.retrieveSuggestedTitle();
        }
        this.genPendding = false;
        this.changeDetectorRef.detectChanges();
      },
      error: (errMsg: any) => {
        console.log('errMsg: ', errMsg);
        this.genStart = false;
        this.genPendding = false;
        this.haveError = true;
        this.errMessage = errMsg;
        this.changeDetectorRef.detectChanges();
      },
    });
  }

  retrieveSuggestedTitle() {
    this.chatService.retrieve(this.chatUuid).subscribe((res) => {
      this.chatTitle = res.title;
      this.animateRenamedChat();
    });
  }

  continue() {
    this.scrollToBottom();
    this.conversationalService.continue(this.chatUuid).subscribe({
      next: (obs: any) => {
        if (obs.finishReason === 'length') this.showContinueButton = true;
        const message = this.messages;
        const lastMsg = message[message.length - 1];
        if (lastMsg.role === 'user') {
          this.genStart = false;
          message.push({ role: 'assistant', content: obs.content });
        } else {
          lastMsg.content += obs.content;
        }
        this.changeDetectorRef.detectChanges();
      },
      complete: () => {
        console.log(this.messages.length);

        if (this.messages.length === 2) {
          this.retrieveSuggestedTitle();
        }
        this.genPendding = false;
        this.changeDetectorRef.detectChanges();
      },
      error: (errMsg: any) => {
        console.log('errMsg: ', errMsg);
        this.genStart = false;
        this.genPendding = false;
        this.haveError = true;
        this.errMessage = errMsg;
        this.changeDetectorRef.detectChanges();
      },
    });
  }

  stop() {
    // stop não pode ser usado ainda pois o backend continua recebendo tokens da OpenAI API. Para usar stop, é necessário que o backend receba um aviso de conexão abortada pelo cliente e então abortar a stream de dados da OpenAI API.
    this.conversationalService.stop();
    this.genStart = false;
    this.genPendding = false;
  }

  reGenerate() {
    // regenerate não pode ser usado ainda pois o backend só calcula o valor de tokens gastos em stream após o fim do recebimento. Para usar regenerate, é necessário que o backend calcule o valor de tokens gastos a cada mensagem recebida.
    this.haveError = false;
    if (this.messages[this.messages.length - 1].role === 'assistant') {
      this.messages.pop();
    }
    this.genStart = true;
    this.genPendding = true;
    this.conversationalService.isStream
      ? this.chatStream(this.chatInputPersistent)
      : this.chat(this.chatInputPersistent);
  }

  mouseout() {
    this.hoverIndex = -1;
  }

  changeTitle(input: HTMLInputElement, title: HTMLDivElement) {
    input.classList.remove('d-none');
    title.classList.add('d-none');
    setTimeout(() => {
      input.focus();
    });
  }

  changeTitleSubmit(input: HTMLInputElement, title: HTMLDivElement) {
    const value = input.value.trim();
    if (value) {
      this.chatTitle = value;
    }
    input.classList.add('d-none');
    title.classList.remove('d-none');

    this.chatService.rename(this.chatUuid, value).subscribe((res) => {});
    this.animateRenamedChat();
  }

  chatListHover(index: number) {
    this.hoverIndex = index;
  }

  // scrollToBottom() {
  //   if (this.messageContainer) {
  //     this.messageContainer.nativeElement.scrollIntoView({
  //       behavior: 'auto',
  //       block: 'end',
  //     });
  //   }
  // }

  scrollToBottom() {
    if (this.messageWrapper) {
      const containerElement = this.messageWrapper.nativeElement;
      containerElement.scrollIntoView();
    }
  }

  animateRenamedChat(): void {
    this.estadoAnimacao = true;
    this.changeDetectorRef.detectChanges();
    setTimeout(() => {
      this.estadoAnimacao = false;
    }, 1000);
  }
}
