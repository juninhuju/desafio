import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';

/**
 * Guard de rota para proteger páginas que requerem autenticação.
 */
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getToken();

  if (token) {
    return true; // Usuário logado
  }

  return router.createUrlTree(['/home']); // Redireciona se não logado
};
