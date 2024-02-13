import { ChatService } from 'src/app/services/chat.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertMessageService } from 'src/app/services/alert-message.service';
import { InsufficientBalanceService } from 'src/app/services/insufficient-balance.service';

@Component({
  selector: 'app-new-chat',
  templateUrl: './new-chat.component.html',
  styleUrls: ['./new-chat.component.scss'],
})
export class NewChatComponent implements OnInit, OnDestroy {
  selectedModel: any = undefined;
  mostrarBloqueio: boolean = false;
  subBloqueio: Subscription;

  constructor(
    private chatService: ChatService,
    private router: Router,
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

  createChat(): void {
    if (this.mostrarBloqueio) {
      this.alertMessageService.insufficientBalanceAlert();
    } else {
      this.chatService.create().subscribe((res) => {
        this.router.navigate(['/conversational/chat-gpt', res.uuid]);
      });
    }
  }

  ngOnDestroy(): void {
    this.subBloqueio.unsubscribe();
  }
}
