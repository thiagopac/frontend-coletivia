import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountBalanceComponent } from 'src/app/components/account-balance/account-balance.component';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { LoadingWrapperComponent } from 'src/app/components/loading-wrapper/loading-wrapper.component';

const components = [AccountBalanceComponent, LoadingWrapperComponent];

@NgModule({
  declarations: components,
  imports: [CommonModule, PipesModule],
  exports: components,
})
export class WidgetsModule {}
