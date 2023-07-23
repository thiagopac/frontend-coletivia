import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthModel, AuthRegisterModel } from 'src/app/models/auth';
import { IAdmin } from 'src/app/models/admin';

@Injectable({
  providedIn: 'root',
})
export class AdminAuthHTTPService {
  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<AuthModel> {
    return this.http.post<AuthModel>(`${environment.apiUrl}/admin-auth/login`, {
      email,
      password,
    });
  }

  createUser(reg: AuthRegisterModel): Observable<IAdmin> {
    return this.http.post<IAdmin>(
      `${environment.apiUrl}/admin-auth/register`,
      reg
    );
  }

  getUserByToken(token: string): Observable<IAdmin> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      hideSpinner: 'true',
    });
    return this.http.get<IAdmin>(`${environment.apiUrl}/admin-auth/me`, {
      headers: httpHeaders,
    });
  }
}
