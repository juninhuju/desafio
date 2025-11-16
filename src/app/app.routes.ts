import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';
import { DashboardComponent } from './profile/dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
// Importe um componente simples de teste (você precisa criá-lo)
// import { TestComponent } from './test/test.component';

export const routes: Routes = [
  // Rota de Login: Acessível a todos
  {
    path: 'dashboard',
    canActivate: [authGuard], 
    // loadComponent: () => import('./profile/dashboard/dashboard.component').then(m => m.DashboardComponent),
    component: DashboardComponent, // <-- USE O LOGIN COMPONENT TEMPORARIAMENTE
    title: 'CAIXA Investimentos'
  },


    {
    path: 'home',
    component: HomeComponent,
    title: 'CAIXA Investimentos'
  },
  // Rota Padrão ('/'): Redireciona para o dashboard...
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },

  // Rota Curinga ('**'): Redireciona qualquer rota não encontrada para o DASHBOARD...
  {
    path: '**',
    redirectTo: 'home'
  }
];