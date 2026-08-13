import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  if (typeof localStorage === 'undefined') {
    return next(req);
  }

  const token = localStorage.getItem('token');

  console.log('JWT Token:', token);

  if (token) {

    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log(
      'Authorization Header Added'
    );

    return next(authReq);
  }

  return next(req);
};