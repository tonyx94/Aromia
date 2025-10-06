import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {
  private http = inject(HttpClient);
  private url = `${environment.url}`;

  constructor() {}

  getClients(): Observable<any> {
      return this.http.get<any[]>(`${this.url}/clients`);
  }

  getCompanies(): Observable<any> {
      return this.http.get<any[]>(`${this.url}/companies`);
  }

  createClient(data: any) : Observable<any> {
      return this.http.post<any[]>(`${this.url}/clients`, data);
  }

  createCompanies(data: any) : Observable<any> {
      return this.http.post<any[]>(`${this.url}/companies`, data);
  }
 
}
