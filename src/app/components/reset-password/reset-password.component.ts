import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

enum ErrorStates {
  NotSubmitted,
  HasError,
  NoError,
}

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  errorState: ErrorStates = ErrorStates.NotSubmitted;
  errorStates = ErrorStates;
  isLoading$: Observable<boolean>;
  isInvalidUrl = false;

  // private fields
  private unsubscribe: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
    this.isLoading$ = this.authService.isLoading$;
  }

  ngOnInit(): void {
    this.initForm();
    this.retrieveEmailAndTokenFromURL();
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.forgotPasswordForm.controls;
  }

  initForm() {
    this.forgotPasswordForm = this.fb.group({
      token: ['', Validators.required],
      password: [
        '',
        Validators.compose([Validators.required, Validators.minLength(8)]),
      ],
      confirmPassword: ['', Validators.required],
    });
  }

  retrieveEmailAndTokenFromURL() {
    this.route.queryParams.subscribe((params) => {
      const email = params['email'];
      const token = params['token'];
      if (email && token) {
        this.forgotPasswordForm.patchValue({
          token: token,
        });
      } else {
        this.isInvalidUrl = true;
      }
    });
  }

  submit() {
    this.errorState = ErrorStates.NotSubmitted;

    if (this.f.password.value !== this.f.confirmPassword.value) {
      this.errorState = ErrorStates.HasError;
      return;
    }

    const resetPasswordSubscr = this.authService
      .resetPassword(
        this.f.email.value, // No need for email here as it's already set from URL
        this.f.token.value,
        this.f.password.value
      )
      .pipe(first())
      .subscribe((result: boolean) => {
        this.errorState = result ? ErrorStates.NoError : ErrorStates.HasError;
      });

    this.unsubscribe.push(resetPasswordSubscr);
  }
}
