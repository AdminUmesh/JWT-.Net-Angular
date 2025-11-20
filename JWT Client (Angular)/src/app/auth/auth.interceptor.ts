// src/app/auth/auth.interceptor.ts
import { Injectable } from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse,} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private refreshInProgress = false;
  private refreshSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = this.auth.getAccessToken();
    let authReq = req;
    if (accessToken) {
      authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${accessToken}` },
      });
    }

    return next.handle(authReq).pipe(
      catchError((err) => {
        if (err instanceof HttpErrorResponse && err.status === 401) {
          // attempt refresh
          return this.handle401Error(authReq, next);
        }
        return throwError(() => err);
      })
    );
  }

  private handle401Error(req: HttpRequest<any>, next: HttpHandler) {
    if (!this.refreshInProgress) {
      this.refreshInProgress = true;
      this.refreshSubject.next(null);

      return this.auth.refreshToken().pipe(
        switchMap((res: any) => {
          this.refreshInProgress = false;
          if (res && res.accessToken) {
            this.refreshSubject.next(res.accessToken);
            // retry original request with new token
            const newReq = req.clone({
              setHeaders: { Authorization: `Bearer ${res.accessToken}` },
            });
            return next.handle(newReq);
          }
          // no token - redirect to login (client should handle)
          this.auth.clearTokens();
          return throwError(() => new Error('Unable to refresh token'));
        }),
        catchError((err) => {
          this.refreshInProgress = false;
          this.auth.clearTokens();
          return throwError(() => err);
        })
      );
    } else {
      // wait for the refresh to finish, then retry
      return this.refreshSubject.pipe(
        filter((token) => token != null),
        take(1),
        switchMap((token) => {
          const newReq = req.clone({
            setHeaders: { Authorization: `Bearer ${token}` },
          });
          return next.handle(newReq);
        })
      );
    }
  }
}
