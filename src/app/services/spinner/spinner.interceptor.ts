import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { SpinnerHandlerService } from './spinner-handler.service';

@Injectable()
export class SpinnerInterceptor implements HttpInterceptor {
  constructor(private spinnerHandler: SpinnerHandlerService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const hideSpinner = request.headers.get('hideSpinner');

    if (hideSpinner === 'false') {
      this.spinnerHandler.handleRequest('plus');
    }

    return next.handle(request).pipe(
      tap((event) => {
        if (event instanceof HttpResponse) {
          if (hideSpinner === 'false') {
            this.spinnerHandler.handleRequest();
          }
        }
      }),
      catchError((error) => {
        if (hideSpinner === 'false') {
          this.spinnerHandler.handleRequest();
        }
        return throwError(() => error);
      })
    );
  }
}
