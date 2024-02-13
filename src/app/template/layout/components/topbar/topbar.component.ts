import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { LayoutService } from '../../core/layout.service';
import { Observable, Subscription } from 'rxjs';
import { AuthService, UserType } from 'src/app/modules/auth';
import { NotificationService } from 'src/app/services/notificiation.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent implements OnInit, OnDestroy {
  toolbarButtonHeightClass = 'w-30px h-30px w-md-40px h-md-40px';
  toolbarUserAvatarHeightClass = 'symbol symbol-circle symbol-35px';
  toolbarButtonIconSizeClass = 'svg-icon-1';
  headerLeft: string = 'menu';
  dropdownOpen = false;
  unreadCount: number = 0;
  subNotifications: Subscription;

  user$: Observable<UserType>;

  constructor(
    private layout: LayoutService,
    private auth: AuthService,
    private notificationService: NotificationService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.headerLeft = this.layout.getProp('header.left') as string;
    this.user$ = this.auth.currentUserSubject.asObservable();
    this.subscribeToUnreadCount();
  }

  subscribeToUnreadCount(): void {
    this.notificationService.unreadCount$.subscribe((count) => {
      this.unreadCount = count;
      this.changeDetectorRef.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.subNotifications?.unsubscribe();
  }
}
