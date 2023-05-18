import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss'],
})
export class ChatListComponent implements OnInit {
  chats$: Observable<any[]>;

  constructor(
    private router: Router,
    private chatService: ChatService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getChatList();
  }

  getChatList(): void {
    this.chats$ = this.chatService.getChatList();
    this.changeDetectorRef.detectChanges();
  }

  goToChat(chatUuid: string): void {
    // this.router.navigate(['/conversational/chat-gpt', chatUuid]);
    window.location.href = `/conversational/chat-gpt/${chatUuid}`;
  }

  confirmDeleteChat(chatUuid: string): void {
    if (confirm('Tem certeza?')) {
      this.deleteChat(chatUuid);
    }
  }

  deleteChat(chatUuid: string): void {
    this.chatService.deleteChat(chatUuid).subscribe((res) => {
      this.getChatList();
    });
  }
}
