import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/modules/auth';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  list(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/document/list`, {
      headers: this.authService.headerSigned(),
    });
  }

  listForType(type: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/document/list/${type}`, {
      headers: this.authService.headerSigned(),
    });
  }

  retrieve(uuid: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/document/${uuid}`, {
      headers: this.authService.headerSigned(),
    });
  }

  create(uuid: string, extension: string): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}/document/create-document-free`,
      { model: uuid, extension: extension },
      {
        headers: this.authService.headerSigned(),
      }
    );
  }

  sendFile(uuid: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('document', uuid);
    formData.append('file', file);

    return this.http.post<any>(
      `${environment.apiUrl}/document/send-document-file`,
      formData,
      {
        headers: this.authService.headerSigned(),
      }
    );
  }

  analyze(uuid: string): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}/document/analyze-document`,
      { document: uuid },
      {
        headers: this.authService.headerSigned(),
      }
    );
  }

  rename(uuid: string, title: string): Observable<any> {
    return this.http.patch<any>(
      `${environment.apiUrl}/document/${uuid}/rename`,
      { title },
      {
        headers: this.authService.headerSigned(),
      }
    );
  }

  delete(uuid: string): Observable<any> {
    return this.http.delete<any>(
      `${environment.apiUrl}/document/${uuid}/delete`,
      {
        headers: this.authService.headerSigned(),
      }
    );
  }
}
