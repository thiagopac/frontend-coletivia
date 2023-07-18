import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/modules/auth';

@Injectable({
  providedIn: 'root',
})
export class RechargeService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  list(page: number, perPage: number): Observable<any[]> {
    const params = { page: page.toString(), perPage: perPage.toString() };
    return this.http.get<any[]>(`${environment.apiUrl}/recharge/list`, {
      headers: this.authService.headerSigned(),
      params,
    });
  }

  listOptions(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/recharge/options`, {
      headers: this.authService.headerSigned(),
    });
  }

  retrieve(uuid: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${environment.apiUrl}/recharge/retrieve/${uuid}`,
      {
        headers: this.authService.headerSigned(),
      }
    );
  }

  checkout(option: string): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}/recharge/checkout`,
      { option },
      {
        headers: this.authService.headerSigned(),
      }
    );
  }
}
