import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
  },
  
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then( m => m.RegisterPage)
  },
  {
    path: 'products',
    loadComponent: () => import('./pages/products/products.page').then( m => m.ProductsPage)
  },
  {
    path: 'profile', 
    loadComponent: () =>
      import('./pages/profile/profile.page').then((m) => m.ProfilePage),
  },
  {
    path: 'addresses',
    loadComponent: () =>
      import('./pages/addresses/addresses.page').then((m) => m.AddressesPage,),
  },
   {
    path: 'orders', 
    loadComponent: () =>
      import('./pages/orders-history/orders-history.page').then(
        (m) => m.OrdersHistoryPage,
      ),
  },
  {
    path: 'orders/:id', 
    loadComponent: () =>
      import('./pages/order-detail/order-detail.page').then(
        (m) => m.OrderDetailPage,
      ),
  },
];
