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
        title: 'Aromia - Dashboard'
      },
      {
        path: 'pedidos',
        loadComponent: () => import('./pages/home/modules/orders/orders.component').then(m => m.OrdersComponent),
        title: 'Aromia - Pedidos'
      },

      {
        path: 'maintenance',
        loadComponent: () => import('./pages/home/modules/maintenance/maintenance.component').then(m => m.MaintenanceComponent),
        title: 'Aromia - Mantenimiento'
      },
      {
        path: 'users',
        loadComponent: () => import('./pages/home/modules/users/users.component').then(m => m.UsersComponent),
        title: 'Aromia - Usuarios'
      },
      {
        path: 'clients',
        loadComponent: () => import('./pages/home/modules/clients/clients.component').then(m => m.ClientsComponent),
        title: 'Aromia - Clientes'
      },
      {
        path: 'products',
        loadComponent: () => import('./pages/home/modules/products/products.component').then(m => m.ProductsComponent),
        title: 'Aromia - Productos'
      },
      {
        path: 'home',
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
        title: 'Aromia - Inicio'
      },

    ]
  },
  {
    path: '**',
    redirectTo: 'splashscreen'
  }
];