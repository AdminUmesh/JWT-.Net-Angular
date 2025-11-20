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

  loginAdmin() {
    this.auth.login('admin', '123').subscribe(
      (r) => {
        this.result = 'User Loged In';
      },
      (err) => {
        this.result = err;
      }
    );
  }

  callMe() {
    this.http.get(`${environment.apiBaseUrl}/auth/me`).subscribe(
      (r) => {
        console.log(r);
        this.result = 'User Detail Printed in console';
      },
      (err) => {
        this.result = err;
      }
    );
  }

  logout() {
    this.auth.logout().subscribe(
      (r) => {
        this.result = 'User loged Out';
      },
      (err) => {
        this.result = err;
      }
    );
  }
}
