import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IUser } from 'src/app/models/user';
import { environment } from '../../../environments/environment';
import { AuthModel, AuthRegisterModel } from 'src/app/models/auth';

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
    });
    return this.http.get<IUser>(`${environment.apiUrl}/auth/me`, {
      headers: httpHeaders,
    });
  }
}
