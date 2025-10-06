import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment as env } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AromiaApi {
  private http = inject(HttpClient);
  private url = env.baseUrl

  get<T>(endpoint: any, options?: any): Observable<any> {
    return this.http.get<T>(`${this.url}/${endpoint}`, options);
  }

  post<T>(endpoint: any, body: any, options?: any): Observable<any> {
    return this.http.post<T>(`${this.url}/${endpoint}`, body, options);
  }

  put<T>(endpoint: any, body: any, options?: any): Observable<any> {
    return this.http.put<T>(`${this.url}/${endpoint}`, body, options);
  }

  delete<T>(endpoint: any, options?: any): Observable<any> {
    return this.http.delete<T>(`${this.url}/${endpoint}`, options);
  }
}
