import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownMenu1Component } from './dropdown-menu1/dropdown-menu1.component';
import { DropdownMenu2Component } from './dropdown-menu2/dropdown-menu2.component';
import { DropdownMenu3Component } from './dropdown-menu3/dropdown-menu3.component';
import { DropdownChatListComponent } from './dropdown-chatlist/dropdown-chatlist.component';

@NgModule({
  declarations: [
    DropdownMenu1Component,
    DropdownMenu2Component,
    DropdownMenu3Component,
    DropdownChatListComponent,
  ],
  imports: [CommonModule],
  exports: [
    DropdownMenu1Component,
    DropdownMenu2Component,
    DropdownMenu3Component,
    DropdownChatListComponent,
  ],
})
export class DropdownMenusModule {}
