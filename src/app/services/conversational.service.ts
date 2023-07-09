import { Injectable } from '@angular/core';
import { Observable, Subject, catchError, takeUntil, throttleTime } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/modules/auth';
import { ChatResponse, ChatStreamData } from 'src/app/models/chat-response';

@Injectable({
  providedIn: 'root',
})
export class ConversationalService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  private stop$ = new Subject<void>();
  private controller: AbortController;

  isStream: boolean = true;

  stop() {
    if (this.controller) this.controller.abort();
    this.stop$.next();
  }

  continue(chatUuid: string) {
    return new Observable<any>((observer) => {
      const body: any = {
        chat: chatUuid,
      };
      const auth = this.authService.getAuthFromLocalStorage();

      this.controller = new AbortController();
      // fetch(`${environment.apiUrl}/generative-text/fake-stream`, {
      fetch(`${environment.apiUrl}/chat/continue`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth?.token}`,
        },
        signal: this.controller.signal,
      })
        .then((response) => {
          const reader = response.body?.getReader();
          const decoder = new TextDecoder();
          if (!response.ok) {
            reader?.read().then(({ done, value }) => {
              try {
                const err = JSON.parse(decoder.decode(value));
                // console.log('decoder.decode(value): ', decoder.decode(value));
                observer.error(err.error.message);
                console.log('err: ', err);
              } catch (error) {
                observer.error(error);
                console.log('error: ', error);
              }
            });
          }

          function push() {
            return reader?.read().then(({ done, value }) => {
              if (done) {
                observer.complete();
                return;
              }
              const string = decoder.decode(value);
              const eventStr = string.split('\n\n');
              let content = '';
              let finishReason: string | null | undefined;
              for (let i = 0; i < eventStr.length; i++) {
                const str = eventStr[i];
                if (str === 'data: [DONE]') break;
                if (str && str.slice(0, 6) === 'data: ') {
                  const jsonStr = str.slice(6);
                  const data: ChatStreamData = JSON.parse(jsonStr);
                  const thisContent = data.choices[0].delta?.content || '';
                  finishReason = data.choices[0].finish_reason;
                  content += thisContent;
                }
              }
              observer.next({ content, finishReason });
              push();
            });
          }
          push();
        })
        .catch((err: Error) => {
          observer.error(err?.message ?? `${err}`);
        });
    }).pipe(takeUntil(this.stop$));
  }

  chatMessage(chatUuid: string, prompt: string) {
    const body: any = { chat: chatUuid, prompt: prompt };

    return this.http
      .post<any>(`${environment.apiUrl}/chat/send-messages-single`, body, {
        headers: this.authService.headerSigned(),
      })
      .pipe(
        throttleTime(1000),
        catchError((err) => {
          throw this.handleErr(err);
        }),
        takeUntil(this.stop$)
      );
  }

  chatStream(chatUuid: string, prompt: string) {
    return new Observable<any>((observer) => {
      const body: any = {
        chat: chatUuid,
        prompt: prompt,
      };
      const auth = this.authService.getAuthFromLocalStorage();

      this.controller = new AbortController();
      // fetch(`${environment.apiUrl}/generative-text/fake-stream`, {
      fetch(`${environment.apiUrl}/chat/send-messages`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth?.token}`,
        },
        signal: this.controller.signal,
      })
        .then((response) => {
          const reader = response.body?.getReader();
          const decoder = new TextDecoder();
          if (!response.ok) {
            reader?.read().then(({ done, value }) => {
              try {
                const err = JSON.parse(decoder.decode(value));
                // console.log('decoder.decode(value): ', decoder.decode(value));
                observer.error(err.error.message);
                console.log('err: ', err);
              } catch (error) {
                observer.error(error);
                console.log('error: ', error);
              }
            });
          }

          function push() {
            return reader?.read().then(({ done, value }) => {
              if (done) {
                observer.complete();
                return;
              }
              const string = decoder.decode(value);
              const eventStr = string.split('\n\n');
              let content = '';
              let finishReason: string | null | undefined;
              for (let i = 0; i < eventStr.length; i++) {
                const str = eventStr[i];
                if (str === 'data: [DONE]') break;
                if (str && str.slice(0, 6) === 'data: ') {
                  const jsonStr = str.slice(6);
                  const data: ChatStreamData = JSON.parse(jsonStr);
                  const thisContent = data.choices[0].delta?.content || '';
                  finishReason = data.choices[0].finish_reason;
                  content += thisContent;
                }
              }
              observer.next({ content, finishReason });
              push();
            });
          }
          push();
        })
        .catch((err: Error) => {
          observer.error(err?.message ?? `${err}`);
        });
    }).pipe(takeUntil(this.stop$));
  }

  handleErr(err: {
    error: { error: { message: string } };
    message: any;
  }): string {
    if (err instanceof HttpErrorResponse) {
      const err0 = err.error;
      let openAIMsg: string;
      if (typeof err0 === 'string') {
        try {
          openAIMsg = JSON.parse(err0).error.message;
        } catch (error) {
          openAIMsg = err0;
        }
      } else {
        openAIMsg = err.error?.error?.message;
      }
      const msg = openAIMsg || err.message;
      return msg;
    } else {
      return err.message ?? `${err}`;
    }
  }
}
