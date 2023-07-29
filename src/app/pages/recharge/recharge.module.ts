import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RechargeOptionsComponent } from './recharge-options/recharge-options.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckoutPixComponent } from 'src/app/pages/recharge/checkout-pix/checkout-pix.component';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { NgxKjuaModule } from 'ngx-kjua';
import { CountdownModule } from 'ngx-countdown';
import {
  MatPaginatorIntl,
  MatPaginatorModule,
} from '@angular/material/paginator';
import { CustomPaginatorIntlService } from 'src/app/services/custom-paginator-intl.service';
import { RechargeListComponent } from 'src/app/pages/recharge/recharge-list/recharge-list.component';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxMaskModule } from 'ngx-mask';

@NgModule({
  declarations: [
    RechargeOptionsComponent,
    CheckoutPixComponent,
    RechargeListComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PipesModule,
    NgxKjuaModule,
    CountdownModule,
    MatPaginatorModule,
    MatDialogModule,
    NgxMaskModule.forRoot(),
    RouterModule.forChild([
      {
        path: 'options',
        component: RechargeOptionsComponent,
      },
      {
        path: 'checkout-pix/:uuid',
        component: CheckoutPixComponent,
      },
      {
        path: 'list',
        component: RechargeListComponent,
      },
    ]),
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomPaginatorIntlService },
  ],
})
export class RechargeModule {}
