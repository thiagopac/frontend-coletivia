import { Routes } from '@angular/router';

const Routing: Routes = [
  {
    path: 'start',
    loadChildren: () =>
      import('./features/features.module').then((m) => m.FeaturesModule),
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
    path: 'contextual',
    loadChildren: () =>
      import('./contextual/contextual.module').then((m) => m.ContextualModule),
  },
  {
    path: 'account',
    loadChildren: () =>
      import('./account/account.module').then((m) => m.AccountModule),
  },
  {
    path: 'operation',
    loadChildren: () =>
      import('./operation/operation.module').then((m) => m.OperationModule),
  },
  {
    path: 'recharge',
    loadChildren: () =>
      import('./recharge/recharge.module').then((m) => m.RechargeModule),
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
