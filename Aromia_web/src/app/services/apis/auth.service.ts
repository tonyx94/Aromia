import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { StorageService, StorageKey } from '../storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private storageService = inject(StorageService);
  private apiUrl = `${environment.url}`;

  constructor() { }

  login(data: { user: string; password: string }) {
    return this.http.post<{ access_token: string; user: any, mustChangePassword?: boolean }>(`${this.apiUrl}/authentication/login`, data).pipe(
      tap(async (res) => {
        // Usar StorageService en lugar de localStorage
        await this.storageService.set(StorageKey.Token, res.access_token);
        await this.storageService.set(StorageKey.User, res.user);
      })
    );
  }

  forgotPassword(user: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/authentication/forgot-password`, { user });
  }

  validateResetToken(token: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/authentication/validate-reset-token?token=${token}`);
  }

  resetPassword(token: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/authentication/reset-password`, { token, password });
  }

  async logout(): Promise<void> {
    try {
      await this.storageService.remove(StorageKey.Token);
      await this.storageService.remove(StorageKey.User);
      this.router.navigateByUrl('/login');
    } catch (error) {
      console.error('Error durante logout:', error);
      this.router.navigateByUrl('/login');
    }
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await this.storageService.get(StorageKey.Token);
      const user = await this.storageService.get(StorageKey.User);
      
      if (!token || !user || typeof token !== 'string') {
        return false;
      }
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp > currentTime;
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      return false;
    }
  }

  async getToken(): Promise<string | null> {
    try {
      return await this.storageService.get(StorageKey.Token);
    } catch {
      return null;
    }
  }

  async getUser(): Promise<any> {
    try {
      return await this.storageService.get(StorageKey.User);
    } catch {
      return null;
    }
  }

  async mustChangePassword(): Promise<boolean> {
    try {
      const user = await this.getUser();
      return user?.mustChangePassword || false;
    } catch {
      return false;
    }
  }
}