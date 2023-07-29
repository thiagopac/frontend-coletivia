import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/modules/auth';
import { IUser, InfoType, UserType } from 'src/app/models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  updateInfo(info: InfoType): Observable<InfoType> {
    return this.http.patch<InfoType>(
      `${environment.apiUrl}/user/info/update`,
      info,
      {
        headers: this.authService.headerSigned(),
      }
    );
  }

  changePassword(passwords: {
    current_password: string;
    new_password: string;
    password_confirmation: string;
  }): Observable<UserType> {
    return this.http.patch<UserType>(
      `${environment.apiUrl}/users/change-password`,
      passwords,
      {
        headers: this.authService.headerSigned(),
      }
    );
  }

  getBalance(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/user/balance/retrieve`, {
      headers: this.authService.headerSigned(true),
    });
  }

  me(): Observable<IUser> {
    return this.http.get<IUser>(`${environment.apiUrl}/auth/me`, {
      headers: this.authService.headerSigned(),
    });
  }
}
