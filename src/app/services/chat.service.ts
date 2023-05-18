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

  getChatList(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/chat/list`, {
      headers: this.authService.headerSigned(),
    });
  }

  retrieveChat(chatUuid: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/chat/${chatUuid}`, {
      headers: this.authService.headerSigned(),
    });
  }

  getChatWithMessages(chatUuid: string): Observable<ChatMessagesResponse> {
    return this.http.get<ChatMessagesResponse>(
      `${environment.apiUrl}/chat/${chatUuid}/messages`,
      {
        headers: this.authService.headerSigned(),
      }
    );
  }

  createChatFree(modelUuid: string): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}/chat/create-chat-free`,
      { model: modelUuid },
      {
        headers: this.authService.headerSigned(),
      }
    );
  }

  renameChat(chatUuid: string, title: string): Observable<any> {
    return this.http.patch<any>(
      `${environment.apiUrl}/chat/${chatUuid}/rename`,
      { title },
      {
        headers: this.authService.headerSigned(),
      }
    );
  }

  deleteChat(chatUuid: string): Observable<any> {
    return this.http.delete<any>(
      `${environment.apiUrl}/chat/${chatUuid}/delete`,
      {
        headers: this.authService.headerSigned(),
      }
    );
  }
}
