// src/app/features/salaries/salary-form/salary-form.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SalaryService } from '../salary.service';
import { WorkerService } from '../../workers/worker.service';
import { ChargeService } from '../../charges/charge.service';
import { AlertService } from '../../../core/services/alert.service';
import { Salary } from '../../../core/models/salary';
import { Worker } from '../../../core/models/worker';
import { Charge } from '../../../core/models/charge';
import { of, switchMap, forkJoin, catchError } from 'rxjs'; // FIXED: Imported forkJoin and catchError

@Component({
  selector: 'app-salary-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './salary-form.component.html',
  styleUrl: './salary-form.component.scss'
})
export class SalaryFormComponent implements OnInit {
  salaryForm: FormGroup;
  isEditMode: boolean = false;
  salaryId: string | null = null;
  workers: Worker[] = [];
  charges: Charge[] = [];
  isLoading: boolean = true;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private salaryService: SalaryService,
    private workerService: WorkerService,
    private chargeService: ChargeService,
    private alertService: AlertService
  ) {
    this.salaryForm = this.fb.group({
      workerId: ['', Validators.required],
      chargeId: ['', Validators.required],
      baseSalary: [0, [Validators.required, Validators.min(0)]],
      bonus: [0, [Validators.required, Validators.min(0)]],
      deductions: [0, [Validators.required, Validators.min(0)]],
      netSalary: [{ value: 0, disabled: true }, Validators.required], // Disabled for direct user input
      effectiveDate: ['', Validators.required],
      active: [true] // Default to active for new salaries
    });

    // Calculate netSalary whenever related fields change
    this.salaryForm.valueChanges.subscribe(value => {
      const base = value.baseSalary || 0;
      const bonus = value.bonus || 0;
      const deductions = value.deductions || 0;
      const net = base + bonus - deductions;
      // Only update if the calculated net is different to prevent infinite loop
      if (this.salaryForm.get('netSalary')?.value !== net) {
        this.salaryForm.get('netSalary')?.setValue(net, { emitEvent: false });
      }
    });
  }

  ngOnInit(): void {
    // Fetch all workers and charges first
    forkJoin({
      workers: this.workerService.getAllWorkers(),
      charges: this.chargeService.getAllCharges()
    }).pipe(
      // FIXED: Explicitly type 'data' parameter for forkJoin result
      switchMap((data: { workers: Worker[], charges: Charge[] }) => {
        this.workers = data.workers;
        this.charges = data.charges;
        this.salaryId = this.route.snapshot.paramMap.get('id'); // Use snapshot for initial ID
        if (this.salaryId) {
          this.isEditMode = true;
          return this.salaryService.getSalaryById(this.salaryId);
        } else {
          this.isLoading = false;
          return of(null);
        }
      }),
      // FIXED: Imported catchError and typed 'err'
      catchError((err: any) => {
        console.error('Error loading workers/charges or salary:', err);
        this.alertService.showAlert('error', 'Error al cargar datos necesarios para el formulario de salario.');
        this.router.navigate(['/salaries']);
        this.isLoading = false;
        return of(null);
      })
    ).subscribe((salary: Salary | null) => {
      if (salary) {
        this.salaryForm.patchValue(salary);
      }
      this.isLoading = false;
    });
  }

  onSubmit(): void {
    this.salaryForm.markAllAsTouched(); // Mark all controls as touched to show validation errors
    if (this.salaryForm.valid) {
      // Re-enable netSalary to send its value
      this.salaryForm.get('netSalary')?.enable();
      const salaryData: Salary = this.salaryForm.value;
      // Re-disable netSalary for UI consistency
      this.salaryForm.get('netSalary')?.disable();

      if (this.isEditMode && this.salaryId) {
        this.salaryService.updateSalary(this.salaryId, salaryData).subscribe({
          next: () => {
            this.alertService.showAlert('success', 'Salario actualizado correctamente.');
            this.router.navigate(['/salaries']);
          },
          error: (err) => {
            console.error('Error updating salary:', err);
            this.alertService.showAlert('error', 'Error al actualizar el salario.');
          }
        });
      } else {
        this.salaryService.createSalary(salaryData).subscribe({
          next: () => {
            this.alertService.showAlert('success', 'Salario creado correctamente.');
            this.router.navigate(['/salaries']);
          },
          error: (err) => {
            console.error('Error creating salary:', err);
            this.alertService.showAlert('error', 'Error al crear el salario.');
          }
        });
      }
    } else {
      this.alertService.showAlert('warning', 'Por favor, corrige los errores en el formulario.');
    }
  }

  hasError(controlName: string, errorType: string): boolean {
    const control = this.salaryForm.get(controlName);
    // FIXED: Ensure boolean return
    return (control?.touched || control?.dirty || (control && control.value !== '')) && control?.hasError(errorType) || false;
  }
}