import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NewRequestComponent } from './new-request/new-request.component';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [NewRequestComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: 'new-request',
        component: NewRequestComponent,
      },
    ]),
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
})
export class ImageModule {}
