import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
@Injectable({
  providedIn: 'root'
})
export class MachinewebsocketService {

  private socket$: WebSocketSubject<any>;

  constructor() {
    this.socket$ = webSocket('ws://localhost:8000/machine'); // 127.0.0.1:8000
  this.socket$.pipe(
    catchError((error) => {
      console.error('WebSocket connection error:', error);
      return throwError(error);
    })
  ).subscribe();
  }

  getRealTimeData() : Observable<any> {
    return this.socket$.asObservable();
  }
}
