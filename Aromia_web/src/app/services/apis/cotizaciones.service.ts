import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, tap } from 'rxjs';
import { ICotizacion, StatusCotizacion } from '../../models/cotizacion';

@Injectable({
  providedIn: 'root',
})
export class CotizacionesService { 
  private http = inject(HttpClient);
  private url = `${environment.url}`;

  constructor() {}


  setCotizacion(data: any): Observable<any> {
    return this.http.post( `${this.url}/cotizaciones`, data);
  }

  createNewOrder(data: any): Observable<any> {
    return this.http.post( `${this.url}/orders`, data);
  }

  getCotizaciones(params: {
    status: any;
    page: any;
    limit: any;
  }): Observable<any> {
    return this.http.get<any[]>(
      `${this.url}/cotizaciones/status/${params.status}`,
    );
  }

  getByStatus(status: StatusCotizacion,page: number = 1,limit: number = 10, search?: string): Observable<{
    data: any[]; total: number; page: number; limit: number}> {

    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('search', search || "")

    return this.http
    .get<{data: any[];total: number;page: number;limit: number}>(
      `${this.url}/cotizaciones/status/${status}`, { params }
    );
  }

  updateCotizacion(data: ICotizacion): Observable<any> {
    return this.http.patch( `${this.url}/cotizaciones/${data.id}`, data);
  }

  getFilteredCotizaciones(
  status: StatusCotizacion,
  page: number,
  limit: number,
  search: string = '',
  sortField: string = '',
  sortOrder: number = 1
): Observable<{
  data: any[],
  total: number,
  page: number,
  limit: number
}> {
  let params = new HttpParams()
    .set('page', page)
    .set('limit', limit)
    .set('search', search)
    .set('sortField', sortField)
    .set('sortOrder', sortOrder);

  return this.http.get<{
    data: any[],
    total: number,
    page: number,
    limit: number 
  }>(`${this.url}/cotizaciones/status/${status}`, { params });
}

  getTipoCambio(): Observable<any> {
    const url = "https://api.hacienda.go.cr/indicadores/tc"
    return this.http.get( `${url}`);
  }
}
