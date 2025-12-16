import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class WebsocketService {
    private socket: Socket;

    constructor() {
        this.socket = io(environment.wsUrl, {
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5
        });

        this.socket.on('connect', () => {
            console.log('✅ WebSocket connected:', this.socket.id);
        });

        this.socket.on('disconnect', () => {
            console.log('❌ WebSocket disconnected');
        });

        this.socket.on('connect_error', (error) => {
            console.error('WebSocket connection error:', error);
        });
    }

    /**
     * Listen for a specific event
     */
    on<T>(eventName: string): Observable<T> {
        return new Observable(observer => {
            this.socket.on(eventName, (data: T) => {
                observer.next(data);
            });

            // Cleanup on unsubscribe
            return () => {
                this.socket.off(eventName);
            };
        });
    }

    /**
     * Emit an event to the server
     */
    emit(eventName: string, data?: any): void {
        this.socket.emit(eventName, data);
    }

    /**
     * Disconnect the socket
     */
    disconnect(): void {
        if (this.socket) {
            this.socket.disconnect();
        }
    }

    /**
     * Reconnect the socket
     */
    connect(): void {
        if (this.socket) {
            this.socket.connect();
        }
    }
}
