import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DalleCreateComponent } from './dalle/dalle-create/dalle-create.component';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MidjourneyCreateComponent } from 'src/app/pages/image/midjourney/midjourney-create/midjourney-create.component';
import { MidjourneyGalleryComponent } from 'src/app/pages/image/midjourney/midjourney-gallery/midjourney-gallery.component';
import { MidjourneyGenerationComponent } from './midjourney/midjourney-generation/midjourney-generation.component';
import { ImagesCarouselComponent } from 'src/app/components/images-carousel/images-carousel.component';
import { InstagramFeedItemComponent } from 'src/app/components/instagram-feed-item/instagram-feed-item.component';
import {
  MatPaginatorIntl,
  MatPaginatorModule,
} from '@angular/material/paginator';
import { CustomPaginatorIntlService } from 'src/app/services/custom-paginator-intl.service';
import { WidgetsModule } from 'src/app/components/widgets/widgets.module';

@NgModule({
  declarations: [
    DalleCreateComponent,
    MidjourneyCreateComponent,
    MidjourneyGalleryComponent,
    MidjourneyGenerationComponent,
    MidjourneyGenerationComponent,
    ImagesCarouselComponent,
    InstagramFeedItemComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: 'dalle/create',
        component: DalleCreateComponent,
      },
      {
        path: 'midjourney/create',
        component: MidjourneyCreateComponent,
      },
      {
        path: 'midjourney/gallery',
        component: MidjourneyGalleryComponent,
      },
      {
        path: 'midjourney/generation/:uuid',
        component: MidjourneyGenerationComponent,
      },
    ]),
    FormsModule,
    MatInputModule,
    MatPaginatorModule,
    WidgetsModule,
  ],
  exports: [ImagesCarouselComponent, InstagramFeedItemComponent],
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomPaginatorIntlService },
  ],
})
export class ImageModule {}
