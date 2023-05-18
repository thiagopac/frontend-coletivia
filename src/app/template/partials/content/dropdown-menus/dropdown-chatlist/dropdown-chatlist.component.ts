import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dropdown-chatlist',
  templateUrl: './dropdown-chatlist.component.html',
})
export class DropdownChatListComponent implements OnInit {
  @HostBinding('class') class =
    'menu menu-sub menu-sub-dropdown w-350px w-md-400px h-450px mt-2 p-5';
  @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';

  @Input() chats: any[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {}

  goToChat(chatUuid: string): void {
    // this.router.navigate(['/conversational/chat-gpt', chatUuid]);
    window.location.href = `/conversational/chat-gpt/${chatUuid}`;
  }
}
