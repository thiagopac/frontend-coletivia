import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ManagerComponent } from './manager.component';
import { NavComponent } from 'src/app/modules/manager/layout/nav/nav.component';
import { HeaderComponent } from 'src/app/modules/manager/layout/header/header.component';
import { FooterComponent } from 'src/app/modules/manager/layout/footer/footer.component';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientModule } from '@angular/common/http';

import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

import { PipesModule } from 'src/app/pipes/pipes.module';
import { ManagerHomeComponent } from 'src/app/modules/manager/components/manager-home/manager-home.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { ManagerRoutingModule } from 'src/app/modules/manager/manager-routing.module';
import { ManagerUsersComponent } from 'src/app/modules/manager/components/manager-users/manager-users.component';
import { ManagerAdminsComponent } from 'src/app/modules/manager/components/manager-admins/manager-admins.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    ManagerComponent,
    HeaderComponent,
    FooterComponent,
    NavComponent,
    ManagerHomeComponent,
    ManagerUsersComponent,
    ManagerAdminsComponent,
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatCardModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule,
    MatMenuModule,
    HttpClientModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    PipesModule,
    NgxSpinnerModule,
    ManagerRoutingModule,
    MatDividerModule,
    MatDialogModule,
  ],
  providers: [DatePipe],
})
export class ManagerModule {}
