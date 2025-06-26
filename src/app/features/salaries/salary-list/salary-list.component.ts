// src/app/features/salaries/salary-list/salary-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SalaryService } from '../salary.service';
import { WorkerService } from '../../workers/worker.service';
import { ChargeService } from '../../charges/charge.service';
import { Salary } from '../../../core/models/salary';
import { Worker } from '../../../core/models/worker';
import { Charge } from '../../../core/models/charge';
import { AlertService } from '../../../core/services/alert.service';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, combineLatest, map, Observable, startWith, switchMap } from 'rxjs';

// Define a new interface that includes workerName and chargeName
interface SalaryViewModel extends Salary {
  workerName: string;
  chargeName: string;
}

@Component({
  selector: 'app-salary-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './salary-list.component.html',
  styleUrl: './salary-list.component.scss'
})
export class SalaryListComponent implements OnInit {
  salaries$: Observable<SalaryViewModel[]>;
  activeSalaries$: Observable<SalaryViewModel[]>;
  inactiveSalaries$: Observable<SalaryViewModel[]>;

  filterStatus: 'active' | 'inactive' | 'all' = 'active';
  searchTerm: string = '';

  private refreshSalaries$ = new BehaviorSubject<void>(undefined);

  constructor(
    private salaryService: SalaryService,
    private workerService: WorkerService,
    private chargeService: ChargeService,
    private alertService: AlertService
  ) {
    // Initialize searchTerm$ for consistency
    const searchTerm$ = new BehaviorSubject(this.searchTerm);

    // Fetch all necessary data (salaries, workers, charges)
    this.salaries$ = combineLatest([
      this.refreshSalaries$.pipe(switchMap(() => this.salaryService.getAllSalaries())),
      this.workerService.getAllWorkers(),
      this.chargeService.getAllCharges(),
      searchTerm$.asObservable().pipe(startWith(this.searchTerm))
    ]).pipe(
      map(([salaries, workers, charges, term]: [Salary[], Worker[], Charge[], string]) => {
        // Handle possible undefined for workers/charges/term
        const workerMap = new Map((workers || []).map((w: Worker) => [w.id, `${w.firstName} ${w.lastName}`]));
        const chargeMap = new Map((charges || []).map((c: Charge) => [c.id, c.name]));
        const lowerCaseTerm = (term || '').toLowerCase(); // Use empty string if term is undefined

        return salaries.map((salary: Salary) => ({
          ...salary,
          workerName: workerMap.get(salary.workerId) || 'Desconocido',
          chargeName: chargeMap.get(salary.chargeId) || 'Desconocido'
        })).filter((salary: SalaryViewModel) =>
          // Ensure these properties exist and convert to string for includes
          (salary.workerName || '').toLowerCase().includes(lowerCaseTerm) ||
          (salary.chargeName || '').toLowerCase().includes(lowerCaseTerm) ||
          (salary.netSalary?.toString() || '').includes(lowerCaseTerm) || // Handle netSalary possibly being null/undefined
          (salary.effectiveDate || '').includes(lowerCaseTerm) // Assuming effectiveDate is a string
        ).sort((a: SalaryViewModel, b: SalaryViewModel) => {
          if (a.active !== b.active) {
            return a.active ? -1 : 1;
          }
          return (a.workerName || '').localeCompare(b.workerName || '');
        });
      })
    );

    this.activeSalaries$ = this.salaries$.pipe(
      map(salaries => salaries.filter(salary => salary.active))
    );
    this.inactiveSalaries$ = this.salaries$.pipe(
      map(salaries => salaries.filter(salary => !salary.active))
    );
  }

  ngOnInit(): void {
    this.refreshSalaries$.next();
  }

  onSearchChange(): void {
    // This will implicitly update the searchTerm$ BehaviorSubject if `searchTerm` is bound with ngModel.
    // No explicit call to `searchTerm$.next()` is needed here if it's already bound.
  }

  softDeleteSalary(id: string, workerName: string): void {
    if (confirm(`¿Estás seguro de que quieres inactivar el salario de ${workerName}?`)) {
      this.salaryService.softDeleteSalary(id).subscribe({
        next: () => {
          this.alertService.showAlert('success', `El salario de ${workerName} ha sido inactivado correctamente.`);
          this.refreshSalaries$.next();
        },
        error: (err) => {
          console.error('Error inactivando salario:', err);
          this.alertService.showAlert('error', `Error al inactivar el salario de ${workerName}.`);
        }
      });
    }
  }

  restoreSalary(id: string, workerName: string): void {
    if (confirm(`¿Estás seguro de que quieres restaurar el salario de ${workerName} (activar)?`)) {
      this.salaryService.restoreSalary(id).subscribe({
        next: () => {
          this.alertService.showAlert('success', `El salario de ${workerName} ha sido restaurado y está activo.`);
          this.refreshSalaries$.next();
        },
        error: (err) => {
          console.error('Error restaurando salario:', err);
          this.alertService.showAlert('error', `Error al restaurar el salario de ${workerName}.`);
        }
      });
    }
  }
}