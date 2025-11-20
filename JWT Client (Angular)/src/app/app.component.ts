import { Component } from '@angular/core';
import { environment } from '../environments/environment';
import { AuthService } from './auth/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  result: any;

  constructor(private auth: AuthService, private http: HttpClient) {}

  // src/app/app.component.ts (only the methods)
  loginAdmin() {
    this.auth.login('admin', '123').subscribe(
      (r) => {
        this.result = r;
        console.log('logged in', r);
      },
      (err) => {
        this.result = err;
      }
    );
  }

  callMe() {
    this.http.get(`${environment.apiBaseUrl}/auth/me`).subscribe(
      (r) => {
        this.result = r;
      },
      (err) => {
        this.result = err;
      }
    );
  }

  logout() {
    this.auth.logout().subscribe(
      (r) => {
        this.result = r;
      },
      (err) => {
        this.result = err;
      }
    );
  }
}
