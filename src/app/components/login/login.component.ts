import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { UserType } from 'src/app/models/user';
import { SocketIOService } from 'src/app/services/socket-io.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  defaultAuth: any = {
    email: '',
    password: '',
  };

  loginForm: UntypedFormGroup;
  hasError: boolean;
  returnUrl: string;
  isLoading$: Observable<boolean>;
  showErrors: boolean = false;

  // private fields
  private unsubscribe: Subscription[] = [];

  constructor(
    private fb: UntypedFormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private socketIOService: SocketIOService
  ) {
    this.isLoading$ = this.authService.isLoading$;
    // redirect to home if already logged in
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.initForm();
    this.returnUrl =
      this.route.snapshot.queryParams['returnUrl'.toString()] || '/';
  }

  get f() {
    return this.loginForm.controls;
  }

  initForm() {
    this.loginForm = this.fb.group({
      email: [
        this.defaultAuth.email,
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.minLength(6),
          Validators.maxLength(320),
        ]),
      ],
      password: [
        this.defaultAuth.password,
        Validators.compose([
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(100),
        ]),
      ],
      remember: [null],
    });
  }

  submit() {
    this.hasError = false;
    const loginSubscr = this.authService
      .login(this.f.email.value, this.f.password.value)
      .pipe(first())
      .subscribe((user: UserType | undefined) => {
        if (user) {
          this.socketIOService.login(user);
          this.router.navigate([this.returnUrl]);
        } else {
          this.hasError = true;
        }
      });
    this.unsubscribe.push(loginSubscr);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
