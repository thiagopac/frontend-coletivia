import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AdminAuthService, AdminType } from 'src/app/modules/admin-auth';
import { UserType } from 'src/app/modules/auth';

@Injectable({
  providedIn: 'root',
})
export class ManagerService {
  constructor(
    private http: HttpClient,
    private adminAuthService: AdminAuthService
  ) {}

  getUsers(page: number): Observable<UserType[]> {
    return this.http.get<UserType[]>(
      `${environment.apiUrl}/manager/users/list`,
      {
        headers: this.adminAuthService.headerSigned(),
      }
    );
  }

  getAdmins(page: number): Observable<AdminType[]> {
    return this.http.get<AdminType[]>(
      `${environment.apiUrl}/manager/admins/list`,
      {
        headers: this.adminAuthService.headerSigned(),
      }
    );
  }
}
