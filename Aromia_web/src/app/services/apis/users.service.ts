import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUser } from '../../models/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private http = inject(HttpClient);
  private url = `${environment.url}`;

  constructor() {}

  createUser(data: any): Observable<any> {
    return this.http.post<any[]>(`${this.url}/users`, data);
  }

  getUsers(): Observable<any> {
      return this.http.get<any[]>(`${this.url}/users`);
  }

  changeStatus(data: any) {
     return this.http.patch<any[]>(`${this.url}/users/status`, data);
  }

  update(data: IUser): Observable<any> {
    return this.http.patch<any[]>(`${this.url}/users`, data);
  }


  resetUserPassword(userId: string): Observable<any> {
    return this.http.post(`${this.url}/users/admin/reset-password`, {
      user_id: userId
    });
  }

  forceChangePassword(userId: string, currentPassword: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.url}/authentication/force-change-password`, {
      user_id: userId,
      current_password: currentPassword,
      new_password: newPassword
    });
  }
}
 