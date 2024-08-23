import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/modules/auth';

@Injectable({
  providedIn: 'root',
})
export class ImageAnalysisService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  list(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/image/analysis/list`, {
      headers: this.authService.headerSigned(),
    });
  }

  listForImage(uuid: string): Observable<any> {
    return this.http.get<any>(
      `${environment.apiUrl}/image/analysis/list-for-image/${uuid}`,
      {
        headers: this.authService.headerSigned(),
      }
    );
  }

  retrieve(uuid: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/image/analysis/${uuid}`, {
      headers: this.authService.headerSigned(),
    });
  }

  analyze(imageUuid: string, featureUuid: string): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}/image/analysis/analyze`,
      { image: imageUuid, feature: featureUuid },
      {
        headers: this.authService.headerSigned(),
      }
    );
  }

  delete(uuid: string): Observable<any> {
    return this.http.delete<any>(
      `${environment.apiUrl}/image/analysis/${uuid}/delete`,
      {
        headers: this.authService.headerSigned(),
      }
    );
  }
}
