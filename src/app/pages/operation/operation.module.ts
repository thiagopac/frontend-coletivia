import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { OperationStatementComponent } from './operation-statement/operation-statement.component';
import { PipesModule } from 'src/app/pipes/pipes.module';
import {
  MatPaginatorIntl,
  MatPaginatorModule,
} from '@angular/material/paginator';
import { CustomPaginatorIntlService } from 'src/app/services/custom-paginator-intl.service';

@NgModule({
  declarations: [OperationStatementComponent],
  imports: [
    CommonModule,
    PipesModule,
    MatPaginatorModule,
    RouterModule.forChild([
      {
        path: 'statement',
        component: OperationStatementComponent,
      },
    ]),
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomPaginatorIntlService },
  ],
})
export class OperationModule {}
