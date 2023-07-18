import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
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

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'body[root]',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  constructor(
    private translationService: TranslationService,
    public spinnerHandler: SpinnerHandlerService,
    private spinner: NgxSpinnerService,
    private socketService: SocketIOService,
    private notificationService: NotificationService,
    private alertMessageService: AlertMessageService
  ) {
    // register translations
    this.translationService.loadTranslations(ptBRLang, enLang);
    this.spinnerHandler.showSpinner.subscribe(this.showSpinner.bind(this));
  }

  ngOnInit() {
    this.socketService.onNotificationRefresh().subscribe((data: any) => {
      this.notificationService.triggerUpdate();
    });

    this.socketService.onShowToast().subscribe((data: any) => {
      this.alertMessageService.showToast(data.message, data.icon);
    });
  }

  showSpinner = (state: boolean): void => {
    state === true ? this.spinner.show() : this.spinner.hide();
  };
}
