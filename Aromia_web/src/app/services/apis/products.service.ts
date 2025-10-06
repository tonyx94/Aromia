import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, tap } from 'rxjs';
import { StatusCotizacion } from '../../models/cotizacion';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private http = inject(HttpClient);
  private url = `${environment.url}`;

  constructor() {}

  createProduct(data: {name: string}): Observable<any> {
    return this.http.post( `${this.url}/products`, data);
  }

  getProducts(): Observable<any> {
    return this.http.get<any[]>( `${this.url}/products`);
  }

}
