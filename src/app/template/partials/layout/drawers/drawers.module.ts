import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActivityDrawerComponent } from './activity-drawer/activity-drawer.component';

@NgModule({
  declarations: [ActivityDrawerComponent],
  imports: [CommonModule, RouterModule],
  exports: [ActivityDrawerComponent],
})
export class DrawersModule {}
