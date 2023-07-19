import {
  ChangeDetectorRef,
  Component,
  HostBinding,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { NotificationService } from 'src/app/services/notificiation.service';

@Component({
  selector: 'app-notifications-inner',
  templateUrl: './notifications-inner.component.html',
})
export class NotificationsInnerComponent implements OnInit, OnDestroy {
  @HostBinding('class') class =
    'menu menu-sub menu-sub-dropdown menu-column w-100 w-lg-425px ';
  @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';
  items: any[] = [];
  unreadCount: number = 0;
  subNotifications: Subscription;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private notificationService: NotificationService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.listNotifications();
    this.subscribeToUnreadCount();
    this.subscribeToUpdateNotifications();
  }

  listNotifications() {
    this.notificationService.list('all').subscribe((res: any) => {
      this.notificationService.updateUnreadCount(res.meta.unread_count);

      this.items = res.data.map((item: { created_at: string }) => ({
        ...item,
        timeAgo: this.calculateTimeAgo(item.created_at),
      }));
      this.changeDetectorRef.detectChanges();
    });
  }

  calculateTimeAgo(created_at: string): string {
    const createdAtDate = new Date(created_at);
    const currentDate = new Date();
    const elapsedMilliseconds = currentDate.getTime() - createdAtDate.getTime();

    const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
    if (elapsedSeconds < 60) {
      return elapsedSeconds === 1 ? '1 seg' : `${elapsedSeconds} segs`;
    }

    const elapsedMinutes = Math.floor(elapsedSeconds / 60);
    if (elapsedMinutes < 60) {
      return elapsedMinutes === 1 ? '1 min' : `${elapsedMinutes} mins`;
    }

    const elapsedHours = Math.floor(elapsedMinutes / 60);
    if (elapsedHours < 24) {
      return elapsedHours === 1 ? '1 h' : `${elapsedHours} hs`;
    }

    const elapsedDays = Math.floor(elapsedHours / 24);
    if (elapsedDays < 30) {
      return `${elapsedDays} d`;
    }

    return '+30 d';
  }

  subscribeToUnreadCount(): void {
    this.subNotifications = this.notificationService.unreadCount$.subscribe(
      (count) => {
        this.unreadCount = count;
      }
    );
  }

  subscribeToUpdateNotifications(): void {
    this.notificationService.update$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.listNotifications();
      });
  }

  goToItem(item: any) {
    this.markAsRead(item.id);
    this.router.navigate([item.data.redirectUrl]);
  }

  markAsRead(id: number) {
    this.notificationService.markAsRead(id).subscribe((res: any) => {
      this.listNotifications();
      this.notificationService.updateUnreadCount(this.unreadCount - 1);
    });
  }

  markAllAsRead() {
    this.notificationService.markAllAsRead().subscribe((res: any) => {
      this.listNotifications();
      this.notificationService.updateUnreadCount(0);
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.subNotifications.unsubscribe();
  }
}
