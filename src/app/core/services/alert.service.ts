// src/app/core/services/alert.service.ts
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export interface Alert {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alertSubject = new Subject<Alert>();

  showAlert(type: Alert['type'], message: string): void {
    this.alertSubject.next({ type, message });
  }

  onAlert(): Observable<Alert> {
    return this.alertSubject.asObservable();
  }
}