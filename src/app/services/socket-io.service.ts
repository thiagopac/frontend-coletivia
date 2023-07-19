import { AuthService, UserType } from 'src/app/modules/auth';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { AdminAuthService } from 'src/app/services/admin-auth';

@Injectable({
  providedIn: 'root',
})
export class SocketIOService {
  constructor(
    private socket: Socket,
    private adminAuthService: AdminAuthService,
    private authService: AuthService
  ) {
    const userUuid = this.authService.getUserFromLocalStorage()?.uuid;
    if (userUuid) {
      this.login({ uuid: userUuid } as UserType);
    }
  }

  login(user: UserType) {
    this.socket.emit('login', user!.uuid);
  }

  getWebsocketPayload(data: any) {
    return {
      headers: this.authService.getAuthFromLocalStorage(),
      user: this.authService.getUserFromLocalStorage(),
      data: data,
    };
  }

  run(payload: any) {
    this.socket.emit('ch_run_start', this.getWebsocketPayload(payload));
  }

  onEventFinished() {
    return this.socket.fromEvent('ch_run_finish');
  }

  onNotificationRefresh() {
    return this.socket.fromEvent('ch_notification_refresh');
  }

  onShowToast() {
    return this.socket.fromEvent('ch_show_toast');
  }

  onBalanceRefresh() {
    return this.socket.fromEvent('ch_balance_refresh');
  }

  onCheckoutRefresh() {
    return this.socket.fromEvent('ch_checkout_refresh');
  }
}
