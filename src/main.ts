import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import { LOCALE_ID } from '@angular/core';
import localePt from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';

if (environment.production) {
  enableProdMode();
}

registerLocaleData(localePt, 'pt-BR');

platformBrowserDynamic([{ provide: LOCALE_ID, useValue: 'pt-BR' }])
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
