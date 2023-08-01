import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
} from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { AuthHTTPService, AuthService } from 'src/app/services/auth';
import { first } from 'rxjs/operators';

enum ErrorStates {
  NotSubmitted,
  HasError,
  NoError,
}

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: UntypedFormGroup;
  errorState: ErrorStates = ErrorStates.NotSubmitted;
  errorStates = ErrorStates;
  isLoading$: Observable<boolean>;
  descError: string = '';

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  constructor(
    private fb: UntypedFormBuilder,
    private authService: AuthService,
    private authHTTPService: AuthHTTPService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.isLoading$ = this.authService.isLoading$;
  }

  ngOnInit(): void {
    this.initForm();
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.forgotPasswordForm.controls;
  }

  initForm() {
    this.forgotPasswordForm = this.fb.group({
      email: [
        '',
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.minLength(3),
          Validators.maxLength(320), // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
        ]),
      ],
    });
  }

  submit() {
    this.errorState = ErrorStates.NotSubmitted;
    this.descError = '';
    this.authHTTPService
      .userExists(this.f.email.value)
      .subscribe((userExists) => {
        if (userExists.exists === true && userExists.social_login === 0) {
          const forgotPasswordSubscr = this.authService
            .forgotPassword(this.f.email.value)
            .pipe(first())
            .subscribe((result: boolean) => {
              this.errorState = result
                ? ErrorStates.NoError
                : ErrorStates.HasError;
            });
          this.unsubscribe.push(forgotPasswordSubscr);
          this.changeDetectorRef.detectChanges();
        } else if (
          userExists.exists === true &&
          userExists.social_login === 1
        ) {
          this.descError = `Você vinculou sua conta <strong>${userExists.social_service}</strong> para efetuar login.<br /> Não é possível alterar a senha para contas vinculadas a serviços. Faça login ultilizando sua conta ${userExists.social_service}.`;
          this.changeDetectorRef.detectChanges();
        } else if (userExists.exists === false) {
          this.descError = `Nenhuma conta cadastrada com o e-mail informado`;
          this.changeDetectorRef.detectChanges();
        }
      });
  }
}
