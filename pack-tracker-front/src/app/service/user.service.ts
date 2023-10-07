import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from './user.model';

const TOKEN_KEY = "user_token";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private isLoggedIn = new Subject<any>();
  apiUrl = "http://127.0.0.1:8098";

  constructor(private http: HttpClient) { }


  login(email: string, password: string): Observable<any> {
    const user: User = {
      "email": email,
      "password": password
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }),
    };

    return this.http.post<any>(this.apiUrl + "/packs/login", user, httpOptions);
  }


  logout() {
    window.sessionStorage.clear()
  }

  saveToken(token: string) {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  getToken() {
    return window.sessionStorage.getItem(TOKEN_KEY);
  }

  sendUpdate(message: boolean) {
    this.isLoggedIn.next({ status : message });
  }

  getUpdate() {
    return this.isLoggedIn.asObservable();
  }

}
