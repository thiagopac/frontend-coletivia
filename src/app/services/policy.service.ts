import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PolicyService {
  constructor(private http: HttpClient) {}

  retrievePolicy(type: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/policy/${type}`);
  }
}
