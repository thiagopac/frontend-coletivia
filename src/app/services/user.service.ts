import { InsufficientBalanceService } from './insufficient-balance.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/modules/auth';
import { InfoType, UserType } from 'src/app/models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private insufficientBalanceService: InsufficientBalanceService
  ) {
    this.getBalance().subscribe((res) => {
      if (+res.current_balance <= 0) {
        this.insufficientBalanceService.setBloqueio(true);
      }
    });
  }

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
}
