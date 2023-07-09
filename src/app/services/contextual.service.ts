import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/modules/auth';

@Injectable({
  providedIn: 'root',
})
export class ContextualService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  createChatInformalToFormal(): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}/chat/create-chat-informal-to-formal`,
      {},
      {
        headers: this.authService.headerSigned(),
      }
    );
  }

  createChatLegalToInformal(): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}/chat/create-chat-legal-to-informal`,
      {},
      {
        headers: this.authService.headerSigned(),
      }
    );
  }
}
