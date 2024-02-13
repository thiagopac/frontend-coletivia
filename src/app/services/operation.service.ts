import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/modules/auth';

@Injectable({
  providedIn: 'root',
})
export class OperationService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  listOperations(page: number, perPage: number): Observable<any> {
    const params = { page: page.toString(), perPage: perPage.toString() };
    return this.http.get<any>(`${environment.apiUrl}/operation/list`, {
      headers: this.authService.headerSigned(),
      params,
    });
  }
}
