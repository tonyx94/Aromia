import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment as env } from '../../environments/environment';
import { Observable, from, switchMap } from 'rxjs';
import { StorageService, StorageKey } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AromiaApi {
  private http = inject(HttpClient);
  private storage = inject(StorageService);
  private url = env.baseUrl;

  private async getHeaders(): Promise<HttpHeaders> {
    const token = await this.storage.get<string>(StorageKey.Token);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  get<T>(endpoint: any, options?: any): Observable<any> {
    return from(this.getHeaders()).pipe(
      switchMap(headers => {
        const mergedOptions = { ...options, headers };
        return this.http.get<T>(`${this.url}/${endpoint}`, mergedOptions);
      })
    );
  }

  post<T>(endpoint: any, body: any, options?: any): Observable<any> {
    return from(this.getHeaders()).pipe(
      switchMap(headers => {
        const mergedOptions = { ...options, headers };
        return this.http.post<T>(`${this.url}/${endpoint}`, body, mergedOptions);
      })
    );
  }

  put<T>(endpoint: any, body: any, options?: any): Observable<any> {
    return from(this.getHeaders()).pipe(
      switchMap(headers => {
        const mergedOptions = { ...options, headers };
        return this.http.put<T>(`${this.url}/${endpoint}`, body, mergedOptions);
      })
    );
  }

  delete<T>(endpoint: any, options?: any): Observable<any> {
    return from(this.getHeaders()).pipe(
      switchMap(headers => {
        const mergedOptions = { ...options, headers };
        return this.http.delete<T>(`${this.url}/${endpoint}`, mergedOptions);
      })
    );
  }
}
