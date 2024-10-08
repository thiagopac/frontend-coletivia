import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StartComponent } from './start/start.component';
import { RouterModule } from '@angular/router';
import { ContentLoaderModule } from '@ngneat/content-loader';
import { AvailableFeaturesComponent } from 'src/app/components/available-features/available-features.component';

@NgModule({
  declarations: [StartComponent, AvailableFeaturesComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: StartComponent,
      },
    ]),
    ContentLoaderModule,
  ],
})
export class FeaturesModule {}
