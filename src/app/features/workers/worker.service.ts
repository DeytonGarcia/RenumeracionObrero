// src/app/features/workers/worker.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Worker } from '../../core/models/worker';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WorkerService {
  private apiUrl = `${environment.apiUrl}/workers`;

  constructor(private http: HttpClient) { }

  getAllWorkers(): Observable<Worker[]> {
    return this.http.get<Worker[]>(this.apiUrl);
  }

  getWorkerById(id: string): Observable<Worker> {
    return this.http.get<Worker>(`${this.apiUrl}/${id}`);
  }

  createWorker(worker: Worker): Observable<Worker> {
    return this.http.post<Worker>(this.apiUrl, worker);
  }

  updateWorker(id: string, worker: Worker): Observable<Worker> {
    return this.http.put<Worker>(`${this.apiUrl}/${id}`, worker);
  }

  softDeleteWorker(id: string): Observable<Worker> {
    return this.http.patch<Worker>(`${this.apiUrl}/${id}/soft-delete`, {});
  }

  restoreWorker(id: string): Observable<Worker> {
    return this.http.patch<Worker>(`${this.apiUrl}/${id}/restore`, {});
  }
}