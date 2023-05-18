import { ChatService } from 'src/app/services/chat.service';
import { Component, OnInit } from '@angular/core';
import { ModelService } from 'src/app/services/model.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-chat',
  templateUrl: './new-chat.component.html',
  styleUrls: ['./new-chat.component.scss'],
})
export class NewChatComponent implements OnInit {
  models: any[] = [];
  selectedModel: any = undefined;

  constructor(
    private modelService: ModelService,
    private chatService: ChatService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.modelService.getChatModelListForType('text').subscribe((res) => {
      this.models = res;
    });
  }

  createChat(): void {
    // this.router.navigate([
    //   '/conversational/chat-gpt',
    //   'c1dc051b-ebb3-4c4d-a86f-201de2b69836',
    // ]);
    this.chatService.createChatFree(this.selectedModel).subscribe((res) => {
      console.log(res);
      //route to /chat-gpt and uuid of returned chat
      this.router.navigate(['/conversational/chat-gpt', res.uuid]);
    });
  }
}
