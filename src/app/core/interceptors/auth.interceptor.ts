import { HttpErrorResponse } from '@angular/common/http';
import { HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const router = inject(Router);

  if (typeof localStorage === 'undefined') {
    return next(req);
  }

  const token = localStorage.getItem('token');

  console.log('JWT Token:', token);

  let authReq = req;

  if (token) {

    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('Authorization Header Added');
  }

  return next(authReq).pipe(

    catchError((error: HttpErrorResponse) => {

      if (error.status === 401) {

        console.log('JWT expired or unauthorized');

        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('role');

        router.navigate(['/login']);
      }

      return throwError(() => error);

    })

  );
};