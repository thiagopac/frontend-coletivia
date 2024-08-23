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

  continue(chatUuid: string): Observable<any> {
    return new Observable<any>((observer) => {
      const body: any = {
        chat: chatUuid,
      };
      const auth = this.authService.getAuthFromLocalStorage();

      this.controller = new AbortController();
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
          let buffer = '';

          if (!response.ok) {
            reader?.read().then(({ done, value }) => {
              try {
                const err = JSON.parse(decoder.decode(value));
                observer.error(err.error.message);
              } catch (error) {
                observer.error(error);
              }
            });
          } else {
            function push() {
              reader
                ?.read()
                .then(({ done, value }) => {
                  if (done) {
                    observer.complete();
                    return;
                  }
                  buffer += decoder.decode(value, { stream: true });

                  const eventStr = buffer.split('\n\n');
                  buffer = eventStr.pop() || '';

                  let content = '';
                  let finishReason: string | null | undefined;
                  for (let i = 0; i < eventStr.length; i++) {
                    const str = eventStr[i];
                    if (str === 'data: [DONE]') break;
                    if (str && str.slice(0, 6) === 'data: ') {
                      try {
                        const jsonStr = str.slice(6);
                        const data: ChatStreamData = JSON.parse(jsonStr);
                        const thisContent =
                          data.choices[0].delta?.content || '';
                        finishReason = data.choices[0].finish_reason;
                        content += thisContent;
                      } catch (error: any) {
                        observer.error(`JSON parse error: ${error.message}`);
                        return;
                      }
                    }
                  }
                  observer.next({ content, finishReason });
                  push();
                })
                .catch((err: Error) => {
                  observer.error(err?.message ?? `${err}`);
                });
            }
            push();
          }
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
        headers: this.authService.headerSigned(true),
      })
      .pipe(
        throttleTime(1000),
        catchError((err) => {
          throw this.handleErr(err);
        }),
        takeUntil(this.stop$)
      );
  }

  chatStream(chatUuid: string, prompt: string): Observable<any> {
    return new Observable<any>((observer) => {
      const body: any = { chat: chatUuid, prompt: prompt };
      const auth = this.authService.getAuthFromLocalStorage();

      this.controller = new AbortController();
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
          let buffer = '';

          if (!response.ok) {
            reader?.read().then(({ done, value }) => {
              try {
                const err = JSON.parse(decoder.decode(value));
                observer.error(err.error.message);
              } catch (error) {
                observer.error(error);
              }
            });
          } else {
            function push() {
              reader
                ?.read()
                .then(({ done, value }) => {
                  if (done) {
                    observer.complete();
                    return;
                  }
                  buffer += decoder.decode(value, { stream: true });

                  const eventStr = buffer.split('\n\n');
                  buffer = eventStr.pop() || ''; // Save incomplete JSON chunk for the next read

                  let content = '';
                  let finishReason: string | null | undefined;
                  for (let i = 0; i < eventStr.length; i++) {
                    const str = eventStr[i];
                    if (str === 'data: [DONE]') break;
                    if (str && str.slice(0, 6) === 'data: ') {
                      try {
                        const jsonStr = str.slice(6);
                        const data: ChatStreamData = JSON.parse(jsonStr);
                        const thisContent =
                          data.choices[0].delta?.content || '';
                        finishReason = data.choices[0].finish_reason;
                        content += thisContent;
                      } catch (error: any) {
                        observer.error(`JSON parse error: ${error.message}`);
                        return;
                      }
                    }
                  }
                  observer.next({ content, finishReason });
                  push();
                })
                .catch((err: Error) => {
                  observer.error(err?.message ?? `${err}`);
                });
            }
            push();
          }
        })
        .catch((err: Error) => {
          observer.error(err?.message ?? `${err}`);
        });
    }).pipe(takeUntil(this.stop$));
  }

  private handleErr(err: {
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
