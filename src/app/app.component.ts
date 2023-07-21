import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { TranslationService } from './modules/i18n';
// language list
import { locale as ptBRLang } from './modules/i18n/vocabs/pt-br';
import { locale as enLang } from './modules/i18n/vocabs/en';

// spinner service
import { SpinnerHandlerService } from 'src/app/services/spinner/spinner-handler.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SocketIOService } from 'src/app/services/socket-io.service';
import { NotificationService } from 'src/app/services/notificiation.service';
import { AlertMessageService } from 'src/app/services/alert-message.service';
import { InsufficientBalanceService } from 'src/app/services/insufficient-balance.service';
import { Subscription } from 'rxjs';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'body[root]',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  constructor(
    private translationService: TranslationService,
    public spinnerHandler: SpinnerHandlerService,
    private spinner: NgxSpinnerService,
    private socketService: SocketIOService,
    private notificationService: NotificationService,
    private alertMessageService: AlertMessageService,
    private insufficientBalanceService: InsufficientBalanceService
  ) {
    // register translations
    this.translationService.loadTranslations(ptBRLang, enLang);
    this.spinnerHandler.showSpinner.subscribe(this.showSpinner.bind(this));
  }

  ngOnInit() {
    const sub1: Subscription = this.socketService
      .onNotificationRefresh()
      .subscribe((data: any) => {
        this.notificationService.triggerUpdate();
      });

    const sub2: Subscription = this.socketService
      .onShowToast()
      .subscribe((data: any) => {
        this.alertMessageService.showToast(data.message, data.icon);
      });

    const sub3: Subscription = this.socketService
      .onInsufficientBalanceAlert()
      .subscribe((data: any) => {
        this.insufficientBalanceService.setBloqueio(true);
      });

    const sub4: Subscription = this.socketService
      .onBalanceRefresh()
      .subscribe((data: any) => {
        if (data.balance <= 0) {
          this.insufficientBalanceService.setBloqueio(true);
        } else {
          this.insufficientBalanceService.setBloqueio(false);
        }
      });

    this.subscriptions.push(sub1, sub2, sub3, sub4);
  }

  showSpinner = (state: boolean): void => {
    state === true ? this.spinner.show() : this.spinner.hide();
  };

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
