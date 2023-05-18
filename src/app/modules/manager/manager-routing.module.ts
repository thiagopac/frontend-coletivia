import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManagerAdminsComponent } from 'src/app/modules/manager/components/manager-admins/manager-admins.component';
import { ManagerHomeComponent } from 'src/app/modules/manager/components/manager-home/manager-home.component';
import { ManagerUsersComponent } from 'src/app/modules/manager/components/manager-users/manager-users.component';
import { ManagerComponent } from './manager.component';

export const routes: Routes = [
  {
    path: '',
    component: ManagerComponent,
    children: [
      {
        path: '',
        component: ManagerHomeComponent,
      },
      {
        path: 'home',
        component: ManagerHomeComponent,
      },
      {
        path: 'users',
        component: ManagerUsersComponent,
      },
      {
        path: 'admins',
        component: ManagerAdminsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagerRoutingModule {}
