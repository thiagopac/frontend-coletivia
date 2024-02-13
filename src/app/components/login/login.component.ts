import { AuthHTTPService } from './../../services/auth/auth-http.service';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
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
  descError: string = '';
  unsubscribe: Subscription[] = [];

  constructor(
    private fb: UntypedFormBuilder,
    private authService: AuthService,
    private authHTTPService: AuthHTTPService,
    private route: ActivatedRoute,
    private router: Router,
    private socketIOService: SocketIOService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.isLoading$ = this.authService.isLoading$;

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

  loginWithGoogle(): void {
    this.authHTTPService.redirect().subscribe((res: string) => {
      window.location.href = res;
    });
  }

  submit() {
    this.hasError = false;
    this.authHTTPService
      .userExists(this.f.email.value)
      .subscribe((userExists) => {
        if (userExists.exists === true && userExists.social_login === 0) {
          const loginSubscr = this.authService
            .login(this.f.email.value, this.f.password.value)
            .pipe(first())
            .subscribe((user: UserType | undefined) => {
              if (user) {
                this.socketIOService.login(user);
                this.router.navigate([this.returnUrl]);
              } else {
                this.hasError = true;
                this.descError = 'Usuário ou senha inválidos.';
              }
            });
          this.unsubscribe.push(loginSubscr);
        } else if (
          userExists.exists === true &&
          userExists.social_login === 1
        ) {
          this.hasError = true;
          this.descError = `Você vinculou sua conta ${userExists.social_service} para efetuar login.<br />Clique no botão abaixo <strong>Entrar com conta ${userExists.social_service}</strong>.`;
        } else if (userExists.exists === false) {
          this.hasError = true;
          this.descError = `Você não possui uma conta cadastrada com o e-mail informado. Crie uma conta clicando acima em <strong>Cadastre-se agora</strong>`;
        }

        this.changeDetectorRef.detectChanges();
      });
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
