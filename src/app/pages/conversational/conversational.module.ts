import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ChatGptComponent } from './chat-gpt/chat-gpt.component';
import { MarkdownModule } from 'ngx-markdown';
import { FormsModule } from '@angular/forms';
import { DropdownMenusModule } from 'src/app/template/partials';
import { NewChatComponent } from './new-chat/new-chat.component';
import { MatSelectModule } from '@angular/material/select';
import { ChatListComponent } from './chat-list/chat-list.component';

@NgModule({
  declarations: [ChatGptComponent, NewChatComponent, ChatListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: 'new-chat',
        component: NewChatComponent,
      },
      {
        path: 'chat-gpt/:uuid',
        component: ChatGptComponent,
      },
      {
        path: 'chat-list',
        component: ChatListComponent,
      },
    ]),
    MarkdownModule.forChild(),
    FormsModule,
    DropdownMenusModule,
    MatSelectModule,
  ],
  exports: [ChatGptComponent],
})
export class ConversationalModule {}
