import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login'], { queryParams: { message: 'Veuillez vous connecter pour accéder à cette page' } });
    return false;
  }

  const requiredRole = route.data['role'];
  if (requiredRole && authService.getRole() !== requiredRole) {
    router.navigate(['/dashboard'], { queryParams: { message: 'Accès réservé aux administrateurs' } });
    return false;
  }

  return true;
};