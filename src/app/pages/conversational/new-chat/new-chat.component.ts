import { ChatService } from 'src/app/services/chat.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-new-chat',
  templateUrl: './new-chat.component.html',
  styleUrls: ['./new-chat.component.scss'],
})
export class NewChatComponent implements OnInit {
  selectedModel: any = undefined;

  constructor(private chatService: ChatService, private router: Router) {}

  ngOnInit(): void {}

  createChat(): void {
    this.chatService.create().subscribe((res) => {
      this.router.navigate(['/conversational/chat-gpt', res.uuid]);
    });
  }
}
