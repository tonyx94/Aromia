import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GraphicsService {
  private http = inject(HttpClient);
  private url = `${environment.url}`;

  constructor() { }

  getIngresos(data: { startDate: any, endDate: any }): Observable<any> {
    console.log(data)
    const params = new HttpParams()
      .set('startDate', data.startDate)
      .set('endDate', data.endDate);
    return this.http.get<any[]>(`${this.url}/graphics/dashboard/ingresos`, { params });
  }

  getIngresosPorUsuario(data: { startDate: any, endDate: any }): Observable<any> {
    console.log(data)
    const params = new HttpParams()
      .set('startDate', data.startDate)
      .set('endDate', data.endDate);
    return this.http.get<any[]>(`${this.url}/graphics/dashboard/ingresos-por-usuario`, { params });
  }

  getResume(data: { startDate: any, endDate: any }): Observable<any> {
    console.log(data)
    const params = new HttpParams()
      .set('startDate', data.startDate)
      .set('endDate', data.endDate);
    return this.http.get<any[]>(`${this.url}/graphics/dashboard/resumen`, { params });
  }

  getClientsStats(data: { startDate: any, endDate: any }): Observable<any> {
    console.log(data)
    const params = new HttpParams()
      .set('startDate', data.startDate)
      .set('endDate', data.endDate);
    return this.http.get<any[]>(`${this.url}/graphics/dashboard/clients-stats`, { params });
  }

  getCotizacionesFacturadasStats(data: { startDate: any, endDate: any }): Observable<any> {
    console.log(data)
    const params = new HttpParams()
      .set('startDate', data.startDate)
      .set('endDate', data.endDate);
    return this.http.get<any[]>(`${this.url}/graphics/dashboard/cotizaciones-facturadas-stats`, { params });
  }

  // ===== NEW DASHBOARD STATISTICS METHODS =====

  getSalesOverTime(data: { startDate: any, endDate: any }): Observable<any> {
    const params = new HttpParams()
      .set('startDate', data.startDate)
      .set('endDate', data.endDate);
    return this.http.get<any>(`${this.url}/orders/stats/sales-over-time`, { params });
  }

  getOrdersByStatus(data: { startDate: any, endDate: any }): Observable<any> {
    const params = new HttpParams()
      .set('startDate', data.startDate)
      .set('endDate', data.endDate);
    return this.http.get<any>(`${this.url}/orders/stats/by-status`, { params });
  }

  getRevenueMetrics(data: { startDate: any, endDate: any }): Observable<any> {
    const params = new HttpParams()
      .set('startDate', data.startDate)
      .set('endDate', data.endDate);
    return this.http.get<any>(`${this.url}/orders/stats/revenue-metrics`, { params });
  }

  getMonthlyComparison(data: { startDate: any, endDate: any }): Observable<any> {
    const params = new HttpParams()
      .set('startDate', data.startDate)
      .set('endDate', data.endDate);
    return this.http.get<any>(`${this.url}/orders/stats/monthly-comparison`, { params });
  }

  getTopProducts(data: { startDate: any, endDate: any, limit?: number }): Observable<any> {
    let params = new HttpParams()
      .set('startDate', data.startDate)
      .set('endDate', data.endDate);

    if (data.limit) {
      params = params.set('limit', data.limit.toString());
    }

    return this.http.get<any>(`${this.url}/orders/stats/top-products`, { params });
  }

  getCustomerGrowth(data: { startDate: any, endDate: any }): Observable<any> {
    const params = new HttpParams()
      .set('startDate', data.startDate)
      .set('endDate', data.endDate);
    return this.http.get<any>(`${this.url}/orders/stats/customer-growth`, { params });
  }

}
