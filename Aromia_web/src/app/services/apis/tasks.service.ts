import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private http = inject(HttpClient);
  private url = `${environment.url}`;

  createTask(data: any): Observable<any> {
    return this.http.post(`${this.url}/tasks/bulk`, data);
  }

  getTasks(): Observable<any> {
    return this.http.get<any[]>(`${this.url}/tasks`);
  }

  updateTask(taskData: any) {
    console.log(taskData);
    const { task, products } = this.mapToValidTaskUpdate(taskData);
    return this.http.patch(`${this.url}/tasks/${task.id}`, { ...task, products });
  }

  mapToValidTaskUpdate(data: any): {
    task: any;
    products: any[];
  } {
    const validTaskKeys = [
      'id',
      'cotizacion_id',
      'user_id',
      'dateStart',
      'dateEnd',
      'status',
    ];

    const task: any = {};
    for (const key of validTaskKeys) {
      if (data[key] !== undefined) {
        task[key] = data[key];
      }
    }

    return {
      task,
      products: Array.isArray(data.products) ? data.products : [],
    };
  }
}
