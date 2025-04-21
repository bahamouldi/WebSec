import { Injectable } from '@angular/core';
import { Client, IFrame, IStompSocket } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { environment } from '../../environments/environment';

export interface ScanUpdateMessage {
  scanId: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private stompClient: Client = new Client();
  private url = `${environment.apiUrl}/ws`;
  private connected = false;

  constructor() {
    this.initializeWebSocketConnection();
  }

  initializeWebSocketConnection(): void {
    this.stompClient.webSocketFactory = () => {
      return new SockJS(this.url) as IStompSocket;
    };
    this.stompClient.onConnect = (frame: IFrame) => {
      console.log('Connected: ' + frame);
      this.connected = true;
    };
    this.stompClient.onStompError = (error: any) => {
      console.error('WebSocket error: ', error);
      this.connected = false;
      setTimeout(() => this.initializeWebSocketConnection(), 5000);
    };
    this.stompClient.activate();
  }

  subscribeToScanUpdates(callback: (message: ScanUpdateMessage) => void, retries = 5): void {
    if (this.connected) {
      this.stompClient.subscribe('/topic/scan-updates', (message) => {
        const body: ScanUpdateMessage = JSON.parse(message.body);
        callback(body);
      });
    } else if (retries > 0) {
      console.warn(`WebSocket not connected yet. Retrying in 1s... (${retries} retries left)`);
      setTimeout(() => this.subscribeToScanUpdates(callback, retries - 1), 1000);
    } else {
      console.error('Failed to connect to WebSocket after multiple attempts');
    }
  }

  disconnect(): void {
    if (this.connected) {
      this.stompClient.deactivate();
      console.log('Disconnected');
      this.connected = false;
    }
  }
}