import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/modules/auth';

@Injectable({
  providedIn: 'root',
})
export class DocumentAnalysisService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  list(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/document/analysis/list`, {
      headers: this.authService.headerSigned(),
    });
  }

  listForType(type: string): Observable<any> {
    return this.http.get<any>(
      `${environment.apiUrl}/document/analysis/list/${type}`,
      {
        headers: this.authService.headerSigned(),
      }
    );
  }

  retrieve(uuid: string): Observable<any> {
    return this.http.get<any>(
      `${environment.apiUrl}/document/analysis/${uuid}`,
      {
        headers: this.authService.headerSigned(),
      }
    );
  }

  analyze(documentUuid: string, featureUuid: string): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}/document/analysis/analyze`,
      { document: documentUuid, feature: featureUuid },
      {
        headers: this.authService.headerSigned(),
      }
    );
  }

  delete(uuid: string): Observable<any> {
    return this.http.delete<any>(
      `${environment.apiUrl}/document/analysis/${uuid}/delete`,
      {
        headers: this.authService.headerSigned(),
      }
    );
  }
}
