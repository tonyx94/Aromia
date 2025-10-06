import { Routes } from '@angular/router';
import { authGuard } from './guard/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
    title: 'Login'
  },
  {
    path: 'splashscreen',
    loadComponent: () => import('./pages/splashscreen/splashscreen.component').then(m => m.SplashscreenComponent),
    title: 'Cargando...'
  },
  {
    path: 'change-password',
    loadComponent: () => import('./pages/change-password/change-password.component').then(m => m.ChangePasswordComponent),
    canActivate: [authGuard],
    title: 'Cambiar Contraseña'
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    canActivate: [authGuard],
    title: 'Inicio',
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/home/modules/dashboard/dashboard.component').then(m => m.DashboardComponent),
        title: 'Dashboard'
      },
   
      {
        path: 'maintenance',
        loadComponent: () => import('./pages/home/modules/maintenance/maintenance.component').then(m => m.MaintenanceComponent),
        title: 'Mantenimiento'
      },
      {
        path: 'users',
        loadComponent: () => import('./pages/home/modules/users/users.component').then(m => m.UsersComponent),
        title: 'Usuarios'
      },
       {
        path: 'home',
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
        title: 'Inicio'
      },
  
    ]
  },
  {
    path: '**',
    redirectTo: 'splashscreen'
  }
];