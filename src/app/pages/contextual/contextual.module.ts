import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InformalToFormalComponent } from './informal-to-formal/informal-to-formal.component';
import { LegalToInformalComponent } from './legal-to-informal/legal-to-informal.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MarkdownModule } from 'ngx-markdown';

@NgModule({
  declarations: [InformalToFormalComponent, LegalToInformalComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: 'informal-to-formal',
        component: InformalToFormalComponent,
      },
      {
        path: 'legal-to-informal',
        component: LegalToInformalComponent,
      },
    ]),
    FormsModule,
    MarkdownModule.forChild(),
  ],
})
export class ContextualModule {}
