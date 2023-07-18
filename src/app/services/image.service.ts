import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/modules/auth';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  listGenerationsDalle(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/image/dalle/list`, {
      headers: this.authService.headerSigned(),
    });
  }

  createGenerationDalle(
    prompt: string,
    size: string,
    variations: number,
    translate: boolean
  ): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}/image/dalle/create-image-free`,
      { prompt, size, variations, translate },
      {
        headers: this.authService.headerSigned(),
      }
    );
  }

  deleteGenerationDalle(imageGenerationUuid: string): Observable<any> {
    return this.http.delete<any>(
      `${environment.apiUrl}/image/dalle/${imageGenerationUuid}/delete`,
      {
        headers: this.authService.headerSigned(),
      }
    );
  }

  listGenerationsMidjourney(page: number, perPage: number): Observable<any> {
    const headers = this.authService.headerSigned();
    const params = { page: page.toString(), perPage: perPage.toString() };

    return this.http.get<any>(`${environment.apiUrl}/image/midjourney/list`, {
      headers,
      params,
    });
  }

  createGenerationMidjourney(
    prompt: string,
    translate: boolean
  ): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}/image/midjourney/create-image-free`,
      { prompt, translate },
      {
        headers: this.authService.headerSigned(true),
      }
    );
  }

  createUpscaleMidjourney(
    uuid: string,
    option: number,
    index: number
  ): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}/image/midjourney/create-upscale`,
      { generation: uuid, option, index },
      {
        headers: this.authService.headerSigned(),
      }
    );
  }

  deleteGenerationMidjourney(imageGenerationUuid: string): Observable<any> {
    return this.http.delete<any>(
      `${environment.apiUrl}/image/midjourney/${imageGenerationUuid}/delete`,
      {
        headers: this.authService.headerSigned(),
      }
    );
  }

  retrieveGenerationMidjourney(uuid: string): Observable<any> {
    return this.http.get<any>(
      `${environment.apiUrl}/image/midjourney/retrieve/${uuid}`,
      {
        headers: this.authService.headerSigned(),
      }
    );
  }
}
