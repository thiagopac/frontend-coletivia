import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { IUser } from 'src/app/models/user';
import { environment } from '../../../environments/environment';
import { AuthModel, AuthRegisterModel } from 'src/app/models/auth';
import { Params } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthHTTPService {
  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post<AuthModel>(`${environment.apiUrl}/auth/login`, {
      email,
      password,
    });
  }

  createUser(reg: AuthRegisterModel): Observable<IUser> {
    return this.http.post<IUser>(`${environment.apiUrl}/auth/register`, reg);
  }

  // Server must check email => If email exists send link to the user and return true | If email doesn't exist return false
  forgotPassword(email: string): Observable<boolean> {
    return this.http.post<boolean>(
      `${environment.apiUrl}/auth/forgot-password`,
      {
        email,
      }
    );
  }

  getUserByToken(token: string): Observable<IUser> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      hideSpinner: 'false',
    });
    return this.http.get<IUser>(`${environment.apiUrl}/auth/me`, {
      headers: httpHeaders,
    });
  }

  userExists(email: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/auth/user-exists`, {
      email,
    });
  }

  redirect(): Observable<string> {
    const requestOptions = {
      headers: new HttpHeaders(),
      responseType: 'arraybuffer' as const,
    };

    return this.http
      .get(`${environment.apiUrl}/google/redirect`, requestOptions)
      .pipe(
        map((response: ArrayBuffer) => {
          const decoder = new TextDecoder('utf-8');
          return decoder.decode(response);
        })
      );
  }

  callback(queryParams: Params): Observable<any> {
    const params = new HttpParams({ fromObject: queryParams });
    return this.http.get(`${environment.apiUrl}/google/callback`, { params });
  }
}
