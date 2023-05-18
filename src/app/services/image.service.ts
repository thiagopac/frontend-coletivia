import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/modules/auth';
import { ChatMessagesResponse } from 'src/app/models/chat-messages-response';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  getImageGenerationList(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/image/list`, {
      headers: this.authService.headerSigned(),
    });
  }

  createImageGeneration(
    prompt: string,
    size: string,
    variations: number,
    translate: boolean
  ): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}/image/create-image-free`,
      { prompt, size, variations, translate },
      {
        headers: this.authService.headerSigned(),
      }
    );
  }

  deleteImageGeneration(imageGenerationUuid: string): Observable<any> {
    return this.http.delete<any>(
      `${environment.apiUrl}/image/${imageGenerationUuid}/delete`,
      {
        headers: this.authService.headerSigned(),
      }
    );
  }
}
