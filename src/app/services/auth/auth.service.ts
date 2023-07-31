import { EnvironmentService } from './../environment.service';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { map, catchError, switchMap, finalize } from 'rxjs/operators';
import { UserType } from 'src/app/models/user';
import { AuthModel, AuthRegisterModel } from 'src/app/models/auth';
import { AuthHTTPService } from './auth-http.service';
import { Params, Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  // private fields
  private unsubscribe: Subscription[] = [];
  private authLocalStorage = `${this.environmentService.getVersion()}-${this.environmentService.getAuthDataKey()}`;
  private userLocalStorage = `${this.environmentService.getVersion()}-${this.environmentService.getUserDataKey()}`;

  // public fields
  currentUser$: Observable<UserType>;
  isLoading$: Observable<boolean>;
  currentUserSubject: BehaviorSubject<UserType>;
  isLoadingSubject: BehaviorSubject<boolean>;

  get currentUserValue(): UserType {
    return this.currentUserSubject.value;
  }

  set currentUserValue(user: UserType) {
    this.currentUserSubject.next(user);
  }

  constructor(
    private authHttpService: AuthHTTPService,
    private router: Router,
    private environmentService: EnvironmentService
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.currentUserSubject = new BehaviorSubject<UserType>(undefined);
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  headerSigned(hideSpinner?: boolean): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.getAuthFromLocalStorage()?.token}`,
      hideSpinner: `${hideSpinner === true ? 'true' : 'false'}`,
    });
  }

  // public methods
  login(email: string, password: string): Observable<UserType> {
    this.isLoadingSubject.next(true);
    return this.authHttpService.login(email, password).pipe(
      map((auth: AuthModel) => {
        const result = this.setAuthToLocalStorage(auth);
        return result;
      }),
      switchMap(() => this.getUserByToken()),
      catchError((err) => {
        console.error('err', err);
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  socialLogin(queryParams: Params): Observable<UserType> {
    this.isLoadingSubject.next(true);
    return this.authHttpService.callback(queryParams).pipe(
      map((auth: AuthModel) => {
        const result = this.setAuthToLocalStorage(auth);
        return result;
      }),
      switchMap(() => this.getUserByToken()),
      catchError((err) => {
        console.error('err', err);
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  logout() {
    localStorage.removeItem(this.authLocalStorage);
    localStorage.removeItem(this.userLocalStorage);
    this.router.navigate(['/auth/login'], {
      queryParams: {},
    });
  }

  getUserByToken(): Observable<UserType> {
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.token) {
      return of(undefined);
    }

    this.isLoadingSubject.next(true);
    return this.authHttpService.getUserByToken(auth.token).pipe(
      map((user: UserType) => {
        if (user) {
          this.currentUserSubject.next(user);
          this.setUserToLocalStorage(user);
        } else {
          this.logout();
        }
        return user;
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  // need create new user then login
  registration(user: AuthRegisterModel): Observable<any> {
    this.isLoadingSubject.next(true);
    return this.authHttpService.createUser(user).pipe(
      map(() => {
        this.isLoadingSubject.next(false);
      }),
      switchMap(() => this.login(user.email, user.password)),
      catchError((err) => {
        console.error('err', err);
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  forgotPassword(email: string): Observable<boolean> {
    this.isLoadingSubject.next(true);
    return this.authHttpService
      .forgotPassword(email)
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  resetPassword(
    email: string,
    token: string,
    newPassword: string
  ): Observable<boolean> {
    this.isLoadingSubject.next(true);
    return this.authHttpService
      .resetPassword(email, token, newPassword)
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  // private methods
  private setAuthToLocalStorage(auth: AuthModel): boolean {
    // store auth token/type/epiresIn in local storage to keep user logged in between page refreshes
    if (auth && auth.token) {
      localStorage.setItem(this.authLocalStorage, JSON.stringify(auth));
      return true;
    }
    return false;
  }

  private setUserToLocalStorage(user: UserType): boolean {
    // store auth token/type/epiresIn in local storage to keep user logged in between page refreshes
    if (user && user.uuid) {
      localStorage.setItem(this.userLocalStorage, JSON.stringify(user));
      return true;
    }
    return false;
  }

  getAuthFromLocalStorage(): AuthModel | undefined {
    try {
      const lsValue = localStorage.getItem(this.authLocalStorage);
      if (!lsValue) {
        return undefined;
      }

      const authData = JSON.parse(lsValue);
      return authData;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  getUserFromLocalStorage(): UserType | undefined {
    try {
      const lsValue = localStorage.getItem(this.userLocalStorage);
      if (!lsValue) {
        return undefined;
      }

      const userData = JSON.parse(lsValue);
      return userData;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
