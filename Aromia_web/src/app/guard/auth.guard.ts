import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { StorageService, StorageKey } from '../services/storage.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const storageService = inject(StorageService);

  try {
    // Usar StorageKey.Token en lugar de string literal
    const token = await storageService.get(StorageKey.Token); 
    const user = await storageService.get(StorageKey.User);
    
    if (typeof token === 'string' && user) {
      if (isTokenValid(token)) {
        return true; 
      } else {
        // Token expirado, limpiar usando StorageService
        await clearAuthData(storageService);
        router.navigateByUrl('/login');
        return false;
      }
    } else {
      // No hay token o usuario, redirigir a login
      router.navigateByUrl('/login');
      return false;
    }
  } catch (error) {
    console.error('Error verificando autenticación:', error);
    await clearAuthData(storageService);
    router.navigateByUrl('/login');
    return false;
  }
};

function isTokenValid(token: string): boolean {
  try {
    // Decodificar el payload del JWT
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    
    return payload.exp > currentTime;
  } catch (error) {
    console.warn('Token JWT no válido:', error);
    return false;
  }
}

// Usar StorageService en lugar de localStorage directamente
async function clearAuthData(storageService: StorageService): Promise<void> {
  try {
    await storageService.remove(StorageKey.Token);
    await storageService.remove(StorageKey.User);
  } catch (error) {
    console.error('Error limpiando datos de autenticación:', error);
  }
}