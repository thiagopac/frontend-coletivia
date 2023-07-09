import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/modules/auth';
import { ChatMessagesResponse } from 'src/app/models/chat-messages-response';

@Injectable({
  providedIn: 'root',
})
export class InstagramService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  createInstagramPost(): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}/instagram/create-post`,
      {},
      {
        headers: this.authService.headerSigned(),
      }
    );
  }

  generateTextInstagramPost(post: string, prompt: string): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}/instagram/generate-text`,
      { post, prompt },
      {
        headers: this.authService.headerSigned(),
      }
    );
  }

  generateTextImagineInstagramPost(
    post: string,
    textPost: string
  ): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}/instagram/generate-text-imagine`,
      { post, textPost },
      {
        headers: this.authService.headerSigned(),
      }
    );
  }

  generateImageInstagramPost(
    post: string,
    imagine: string,
    translate: boolean,
    size: string
  ): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}/instagram/generate-image`,
      { post, imagine, translate, size },
      {
        headers: this.authService.headerSigned(),
      }
    );
  }

  upscaleImageInstagramPost(
    post: string,
    option: number,
    index: number
  ): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}/instagram/upscale-image`,
      { post, option, index },
      {
        headers: this.authService.headerSigned(),
      }
    );
  }

  retrieveInstagramPost(uuid: string): Observable<any> {
    return this.http.get<any>(
      `${environment.apiUrl}/instagram/retrieve/${uuid}`,
      {
        headers: this.authService.headerSigned(),
      }
    );
  }

  listInstagramPosts(page: number, pageSize: number): Observable<any> {
    const params = {
      page: page.toString(),
      pageSize: pageSize.toString(),
    };

    return this.http.get<any>(`${environment.apiUrl}/instagram/list`, {
      headers: this.authService.headerSigned(),
      params: params,
    });
  }

  deleteInstagramPost(uuid: string): Observable<any> {
    return this.http.delete<any>(
      `${environment.apiUrl}/instagram/${uuid}/delete`,
      {
        headers: this.authService.headerSigned(),
      }
    );
  }
}
