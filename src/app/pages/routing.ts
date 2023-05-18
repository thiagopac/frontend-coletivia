import { ConversationalModule } from './conversational/conversational.module';
import { Routes } from '@angular/router';

const Routing: Routes = [
  {
    path: 'start',
    loadChildren: () =>
      import('./features.module').then((m) => m.FeaturesModule),
  },
  {
    path: 'conversational',
    loadChildren: () =>
      import('./conversational/conversational.module').then(
        (m) => m.ConversationalModule
      ),
  },
  {
    path: 'image',
    loadChildren: () =>
      import('./image/image.module').then((m) => m.ImageModule),
  },
  {
    path: 'account',
    loadChildren: () =>
      import('./account/account.module').then((m) => m.AccountModule),
  },
  {
    path: '',
    redirectTo: '/start',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'error/404',
  },
];

export { Routing };
