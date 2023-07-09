import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/modules/auth';
import { ChatMessagesResponse } from 'src/app/models/chat-messages-response';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  listForType(type: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/chat/list/${type}`, {
      headers: this.authService.headerSigned(),
    });
  }

  retrieve(uuid: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/chat/${uuid}`, {
      headers: this.authService.headerSigned(),
    });
  }

  getChatWithMessages(uuid: string): Observable<ChatMessagesResponse> {
    return this.http.get<ChatMessagesResponse>(
      `${environment.apiUrl}/chat/${uuid}/messages`,
      {
        headers: this.authService.headerSigned(),
      }
    );
  }

  create(): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}/chat/create-chat-free`,
      {},
      {
        headers: this.authService.headerSigned(),
      }
    );
  }

  rename(uuid: string, title: string): Observable<any> {
    return this.http.patch<any>(
      `${environment.apiUrl}/chat/${uuid}/rename`,
      { title },
      {
        headers: this.authService.headerSigned(),
      }
    );
  }

  delete(uuid: string): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/chat/${uuid}/delete`, {
      headers: this.authService.headerSigned(),
    });
  }
}
