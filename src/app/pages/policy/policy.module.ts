import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PolicyContentComponent } from './policy-content/policy-content.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [PolicyContentComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: 'politica-de-privacidade',
        component: PolicyContentComponent,
      },
      {
        path: 'termos-de-uso',
        component: PolicyContentComponent,
      },
    ]),
  ],
})
export class PolicyModule {}
