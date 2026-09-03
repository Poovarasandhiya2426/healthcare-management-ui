import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(
    private http: HttpClient
  ) {}

  // =========================
  // LOGIN
  // =========================
  login(request: LoginRequest): Observable<LoginResponse> {

    return this.http
      .post<LoginResponse>(
        `${this.apiUrl}/login`,
        request
      )
      .pipe(

        tap((response) => {

          if (typeof window !== 'undefined') {

            window.localStorage.setItem(
              'token',
              response.token
            );

            window.localStorage.setItem(
              'username',
              response.username
            );

            window.localStorage.setItem(
              'role',
              response.role
            );

          }

        })

      );
  }


  // =========================
  // GET TOKEN
  // =========================
  getToken(): string | null {

    if (typeof window === 'undefined') {
      return null;
    }

    return window.localStorage.getItem('token');
  }


  // =========================
  // CHECK LOGIN STATUS
  // =========================
  isLoggedIn(): boolean {

    if (typeof window === 'undefined') {
      return false;
    }

    const token = window.localStorage.getItem('token');

    return token !== null && token.trim().length > 0;
  }


  // =========================
  // LOGOUT
  // =========================
  logout(): void {

    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.removeItem('token');

    window.localStorage.removeItem('username');

    window.localStorage.removeItem('role');
  }

}