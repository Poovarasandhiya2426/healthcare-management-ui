import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {

  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('🔐 AUTH GUARD EXECUTED');

  console.log(
    '🌐 Window:',
    typeof window !== 'undefined'
  );

  console.log(
    '🎫 Token:',
    authService.getToken()
  );

  console.log(
    '✅ Is Logged In:',
    authService.isLoggedIn()
  );

  if (authService.isLoggedIn()) {

    console.log('➡️ Guard allowing access');

    return true;
  }

  console.log('❌ Guard redirecting to login');

  return router.createUrlTree(['/login']);
};