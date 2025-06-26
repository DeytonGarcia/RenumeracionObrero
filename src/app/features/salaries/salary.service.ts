// src/app/features/salaries/salary.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Salary } from '../../core/models/salary';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SalaryService {
  private apiUrl = `${environment.apiUrl}/salaries`;

  constructor(private http: HttpClient) { }

  getAllSalaries(): Observable<Salary[]> {
    return this.http.get<Salary[]>(this.apiUrl);
  }

  getSalaryById(id: string): Observable<Salary> {
    return this.http.get<Salary>(`${this.apiUrl}/${id}`);
  }

  createSalary(salary: Salary): Observable<Salary> {
    return this.http.post<Salary>(this.apiUrl, salary);
  }

  updateSalary(id: string, salary: Salary): Observable<Salary> {
    return this.http.put<Salary>(`${this.apiUrl}/${id}`, salary);
  }

  softDeleteSalary(id: string): Observable<Salary> {
    return this.http.patch<Salary>(`${this.apiUrl}/${id}/soft-delete`, {});
  }

  restoreSalary(id: string): Observable<Salary> {
    return this.http.patch<Salary>(`${this.apiUrl}/${id}/restore`, {});
  }
}