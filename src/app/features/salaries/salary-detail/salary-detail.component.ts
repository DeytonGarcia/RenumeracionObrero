// src/app/features/salaries/salary-detail/salary-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SalaryService } from '../salary.service';
import { WorkerService } from '../../workers/worker.service'; // Assuming correct path
import { ChargeService } from '../../charges/charge.service'; // Assuming correct path
import { Salary } from '../../../core/models/salary';
import { Worker } from '../../../core/models/worker';
import { Charge } from '../../../core/models/charge';
import { AlertService } from '../../../core/services/alert.service';
import { catchError, forkJoin, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-salary-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './salary-detail.component.html', // FIXED: Correct template URL
  styleUrl: './salary-detail.component.scss'
})
// FIXED: Renamed class from SalaryListComponent to SalaryDetailComponent
export class SalaryDetailComponent implements OnInit {
  salary: Salary | null = null;
  worker: Worker | null = null;
  charge: Charge | null = null;
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private salaryService: SalaryService,
    private workerService: WorkerService,
    private chargeService: ChargeService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (id) {
          return this.salaryService.getSalaryById(id).pipe(
            switchMap((salary: Salary | undefined) => {
              if (salary) {
                this.salary = salary;
                // Use forkJoin to fetch worker and charge concurrently
                return forkJoin({
                  worker: this.workerService.getWorkerById(salary.workerId).pipe(
                    catchError(err => {
                      console.warn(`Worker with ID ${salary.workerId} not found for salary.`, err);
                      return of(null);
                    })
                  ),
                  charge: this.chargeService.getChargeById(salary.chargeId).pipe(
                    catchError(err => {
                      console.warn(`Charge with ID ${salary.chargeId} not found for salary.`, err);
                      return of(null);
                    })
                  )
                });
              } else {
                throw new Error('Salary not found');
              }
            }),
            catchError(error => {
              console.error('Error fetching salary details or related data:', error);
              this.alertService.showAlert('error', 'Error al cargar los detalles del salario.');
              this.router.navigate(['/salaries']);
              return of(null); // Return observable in catchError for the outer switchMap
            })
          );
        } else {
          this.alertService.showAlert('error', 'ID de salario no proporcionado.');
          this.router.navigate(['/salaries']);
          this.isLoading = false;
          return of(null); // Return observable in else block for switchMap
        }
      })
    ).subscribe((results: { worker: Worker | null, charge: Charge | null } | null) => {
      if (results) {
        this.worker = results.worker;
        this.charge = results.charge;
      }
      this.isLoading = false;
    });
  }
}