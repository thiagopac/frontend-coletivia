import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { State } from 'src/app/models/state';
import { City } from 'src/app/models/city';
import { AuthService } from 'src/app/modules/auth';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  getStates(): Observable<State[]> {
    return this.http.get<State[]>(`${environment.apiUrl}/location/states`, {
      headers: this.authService.headerSigned(),
    });
  }

  getCitiesByState(state: any): Observable<City[]> {
    return this.http.get<City[]>(
      `${environment.apiUrl}/location/cities/${state}`,
      {
        headers: this.authService.headerSigned(),
      }
    );
  }
}
