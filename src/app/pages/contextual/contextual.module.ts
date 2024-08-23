import { MatFormFieldModule } from '@angular/material/form-field';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InformalToFormalComponent } from './informal-to-formal/informal-to-formal.component';
import { LegalToInformalComponent } from './legal-to-informal/legal-to-informal.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DocumentUploadComponent } from 'src/app/pages/contextual/document/document-upload/document-upload.component';
import { DocumentListComponent } from 'src/app/pages/contextual/document/document-list/document-list.component';
import { DocumentResumeComponent } from './document/document-resume/document-resume.component';
import { DocumentAnalysisComponent } from 'src/app/pages/contextual/document/document-analysis/document-analysis.component';
import { InstagramGenerateComponent } from './instagram/instagram-generate/instagram-generate.component';
import { InstagramListComponent } from './instagram/instagram-list/instagram-list.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { InstagramViewComponent } from 'src/app/pages/contextual/instagram/instagram-view/instagram-view.component';
import { ImageModule } from 'src/app/pages/image/image.module';
import {
  MatPaginatorModule,
  MatPaginatorIntl,
} from '@angular/material/paginator';
import { CustomPaginatorIntlService } from 'src/app/services/custom-paginator-intl.service';
import { ImageUploadComponent } from 'src/app/pages/contextual/document/image-upload/image-upload.component';
import { ImageListComponent } from 'src/app/pages/contextual/document/image-list/image-list.component';
import { ImageResumeComponent } from 'src/app/pages/contextual/document/image-resume/image-resume.component';
import { ImageAnalysisComponent } from 'src/app/pages/contextual/document/image-analysis/image-analysis.component';

@NgModule({
  declarations: [
    InformalToFormalComponent,
    LegalToInformalComponent,
    DocumentUploadComponent,
    DocumentListComponent,
    DocumentResumeComponent,
    DocumentAnalysisComponent,
    InstagramGenerateComponent,
    InstagramListComponent,
    InstagramViewComponent,
    ImageListComponent,
    ImageResumeComponent,
    ImageUploadComponent,
    ImageAnalysisComponent,
  ],
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
      {
        path: 'document/upload',
        component: DocumentUploadComponent,
      },
      {
        path: 'document/list',
        component: DocumentListComponent,
      },
      {
        path: 'document/resume/:uuid',
        component: DocumentResumeComponent,
      },
      {
        path: 'document/analysis/:uuid',
        component: DocumentAnalysisComponent,
      },
      {
        path: 'instagram/generate',
        component: InstagramGenerateComponent,
      },
      {
        path: 'instagram/list',
        component: InstagramListComponent,
      },
      {
        path: 'instagram/view/:uuid',
        component: InstagramViewComponent,
      },
      {
        path: 'image/upload',
        component: ImageUploadComponent,
      },
      {
        path: 'image/list',
        component: ImageListComponent,
      },
      {
        path: 'image/resume/:uuid',
        component: ImageResumeComponent,
      },
      {
        path: 'image/analysis/:uuid',
        component: ImageAnalysisComponent,
      },
    ]),
    FormsModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    ImageModule,
    MatPaginatorModule,
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomPaginatorIntlService },
  ],
})
export class ContextualModule {}
