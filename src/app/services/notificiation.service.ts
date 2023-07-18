import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/modules/auth';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private unreadCountSubject: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);
  public unreadCount$: Observable<number> =
    this.unreadCountSubject.asObservable();

  private updateSubject: Subject<void> = new Subject<void>();
  public update$: Observable<void> = this.updateSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {}

  updateUnreadCount(count: number): void {
    this.unreadCountSubject.next(count);
  }

  triggerUpdate(): void {
    this.updateSubject.next();
  }

  list(type: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${environment.apiUrl}/notification/list/${type}`,
      {
        headers: this.authService.headerSigned(),
      }
    );
  }

  markAsRead(id: number): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}/notification/mark-as-read`,
      { id },
      {
        headers: this.authService.headerSigned(),
      }
    );
  }

  markAsUnread(id: number): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}/notification/mark-as-unread`,
      { id },
      {
        headers: this.authService.headerSigned(),
      }
    );
  }

  markAllAsRead(): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}/notification/mark-all-as-read`,
      {},
      {
        headers: this.authService.headerSigned(),
      }
    );
  }
}
