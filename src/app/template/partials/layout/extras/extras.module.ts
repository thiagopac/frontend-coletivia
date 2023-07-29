import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NotificationsInnerComponent } from './dropdown-inner/notifications-inner/notifications-inner.component';
import { QuickLinksInnerComponent } from './dropdown-inner/quick-links-inner/quick-links-inner.component';
import { UserInnerComponent } from './dropdown-inner/user-inner/user-inner.component';
import { SearchResultInnerComponent } from './dropdown-inner/search-result-inner/search-result-inner.component';
import { FormsModule } from '@angular/forms';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { TranslationModule } from 'src/app/modules/i18n';
import { WidgetsModule } from 'src/app/components/widgets/widgets.module';

@NgModule({
  declarations: [
    NotificationsInnerComponent,
    QuickLinksInnerComponent,
    SearchResultInnerComponent,
    UserInnerComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TranslationModule,
    PipesModule,
    WidgetsModule,
  ],
  exports: [
    NotificationsInnerComponent,
    QuickLinksInnerComponent,
    SearchResultInnerComponent,
    UserInnerComponent,
  ],
})
export class ExtrasModule {}
