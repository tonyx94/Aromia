import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AromiaApi } from './request';
import { Address } from '../models/adress';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  private baseEndpoint = 'customers/me/addresses';

  constructor(private api: AromiaApi) { }

  getAddresses(customerId: number): Observable<Address[]> {
    console.log('AddressService.getAddresses - customerId:', customerId);
    return this.api.get<Address[]>(`${this.baseEndpoint}?customer_id=${customerId}`);
  }

  addAddress(customerId: number, data: Address): Observable<Address> {
    console.log('AddressService.addAddress - customerId:', customerId);
    console.log('AddressService.addAddress - data:', data);
    const payload = { ...data, customer_id: customerId };
    console.log('AddressService.addAddress - payload:', payload);
    return this.api.post<Address>(this.baseEndpoint, payload);
  }

  updateAddress(customerId: number, id: number, data: Partial<Address>): Observable<Address> {
    console.log('AddressService.updateAddress - customerId:', customerId, 'id:', id);
    return this.api.put<Address>(`${this.baseEndpoint}/${id}`, { ...data, customer_id: customerId });
  }

  deleteAddress(customerId: number, id: number): Observable<void> {
    console.log('AddressService.deleteAddress - customerId:', customerId, 'id:', id);
    return this.api.delete<void>(`${this.baseEndpoint}/${id}`, { body: { customer_id: customerId } });
  }

  setDefault(customerId: number, id: number): Observable<Address> {
    console.log('AddressService.setDefault - customerId:', customerId, 'id:', id);
    const payload = { customer_id: customerId };
    console.log('AddressService.setDefault - payload:', payload);
    return this.api.put<Address>(`${this.baseEndpoint}/${id}/default`, payload);
  }
}