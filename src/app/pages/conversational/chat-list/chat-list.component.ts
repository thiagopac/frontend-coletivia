import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AlertMessageService } from 'src/app/services/alert-message.service';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss'],
})
export class ChatListComponent implements OnInit {
  items$: Observable<any[]>;

  constructor(
    private router: Router,
    private chatService: ChatService,
    private alertMessageService: AlertMessageService
  ) {}

  ngOnInit(): void {
    this.list();
  }

  list(): void {
    this.items$ = this.chatService.listForType('free-chat');
  }

  goTo(uuid?: string): void {
    if (!uuid) this.router.navigate(['/conversational/new-chat']);
    else this.router.navigate(['/conversational/chat-gpt', uuid]);
  }

  confirmDelete(uuid: string): void {
    this.alertMessageService.alertWithHandler(`Tem certeza?`, 'question', () =>
      this.deleteChat(uuid)
    );
  }

  deleteChat(uuid: string): void {
    this.chatService.delete(uuid).subscribe((res) => {
      this.list();
    });
  }
}
