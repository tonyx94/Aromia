import { inject, Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Message } from '../../models/message.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private http = inject(HttpClient);
  private url = `${environment.url}`;
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:2468'); // Cambia por tu dominio real
  }

  sendMessage(message: any) {
    this.socket.emit('send_message', message);
  }

  onMessage(cotizacionId: number): Observable<any> {
    return new Observable(observer => {
      this.socket.on(`message:${cotizacionId}`, data => {
        observer.next(data);
      });
    });
  }

  getMessagesByCotizacion(cotizacionId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.url}/messages/${cotizacionId}`);
  }

  uploadFileMessage(formData: FormData) {
    return this.http.post<Message>(`${this.url}/messages/upload`, formData);
  }
}
