import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AromiaApi } from './request';         
import { Customer } from '../models/customer';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private endpoint = 'customers/me';

  constructor(private api: AromiaApi) {}

  getProfile(): Observable<Customer> {
    return this.api.get<Customer>(this.endpoint);
  }

  updateProfile(data: Customer): Observable<Customer> {
    return this.api.put<Customer>(this.endpoint, data);
  }
}