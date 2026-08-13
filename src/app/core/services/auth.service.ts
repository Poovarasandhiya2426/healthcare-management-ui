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

  login(request: LoginRequest): Observable<LoginResponse> {

    return this.http
      .post<LoginResponse>(
        `${this.apiUrl}/login`,
        request
      )
      .pipe(

        tap((response) => {

          localStorage.setItem(
            'token',
            response.token
          );

          localStorage.setItem(
            'username',
            response.username
          );

          localStorage.setItem(
            'role',
            response.role
          );

        })

      );
  }

  getToken(): string | null {

    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {

    return !!this.getToken();
  }

  logout(): void {

    localStorage.removeItem('token');

    localStorage.removeItem('username');

    localStorage.removeItem('role');
  }
}