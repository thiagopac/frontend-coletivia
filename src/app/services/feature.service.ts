import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/modules/auth';

@Injectable({
  providedIn: 'root',
})
export class FeatureService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  list(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/feature/list`, {
      headers: this.authService.headerSigned(),
    });
  }

  listFeatoresForDocument(uuid: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${environment.apiUrl}/feature/list-for-document/${uuid}`,
      {
        headers: this.authService.headerSigned(),
      }
    );
  }

  listForType(type: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/feature/list/${type}`, {
      headers: this.authService.headerSigned(),
    });
  }
}
