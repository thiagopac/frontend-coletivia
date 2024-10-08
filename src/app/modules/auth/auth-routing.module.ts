import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth.component';
import { LoginComponent } from '../../components/login/login.component';
import { RegistrationComponent } from '../../components/registration/registration.component';
import { ForgotPasswordComponent } from '../../components/forgot-password/forgot-password.component';
import { LogoutComponent } from '../../components/logout/logout.component';
import { GoogleCallbackComponent } from 'src/app/components/google-callback/google-callback.component';
import { PolicyContentComponent } from 'src/app/pages/policy/policy-content/policy-content.component';
import { ResetPasswordComponent } from 'src/app/components/reset-password/reset-password.component';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        component: LoginComponent,
        data: { returnUrl: window.location.pathname },
      },
      {
        path: 'registration',
        component: RegistrationComponent,
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
      },
      {
        path: 'reset-password',
        component: ResetPasswordComponent,
      },
      {
        path: 'logout',
        component: LogoutComponent,
      },
      {
        path: 'google/callback',
        component: GoogleCallbackComponent,
      },
      {
        path: 'politica-de-privacidade',
        component: PolicyContentComponent,
      },
      {
        path: 'termos-de-uso',
        component: PolicyContentComponent,
      },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: '**', redirectTo: 'login', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
