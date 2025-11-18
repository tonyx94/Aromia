import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AromiaApi } from './request';
import { Address } from '../models/adress';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  private baseEndpoint = 'customers/me/addresses';

  constructor(private api: AromiaApi) {}

  getAddresses(): Observable<Address[]> {
    return this.api.get<Address[]>(this.baseEndpoint);
  }

  addAddress(data: Address): Observable<Address> {
    return this.api.post<Address>(this.baseEndpoint, data);
  }

  updateAddress(id: number, data: Partial<Address>): Observable<Address> {
    return this.api.put<Address>(`${this.baseEndpoint}/${id}`, data);
  }

  deleteAddress(id: number): Observable<void> {
    return this.api.delete<void>(`${this.baseEndpoint}/${id}`);
  }

  setDefault(id: number): Observable<Address> {
    return this.api.put<Address>(`${this.baseEndpoint}/${id}/default`, {});
  }
}