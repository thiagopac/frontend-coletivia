import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/modules/auth';
import { ChatMessagesResponse } from 'src/app/models/chat-messages-response';

@Injectable({
  providedIn: 'root',
})
export class ContextualService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  createChatInformalToFormal(modelUuid: string): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}/chat/create-chat-informal-to-formal`,
      { model: modelUuid },
      {
        headers: this.authService.headerSigned(),
      }
    );
  }

  createChatLegalToInformal(modelUuid: string): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}/chat/create-chat-legal-to-informal`,
      { model: modelUuid },
      {
        headers: this.authService.headerSigned(),
      }
    );
  }
}
